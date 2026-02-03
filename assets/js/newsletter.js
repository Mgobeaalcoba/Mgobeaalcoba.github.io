// newsletter.js - Newsletter subscription system "The Data Digest"
import logger from './logger.js';

/**
 * NewsletterManager - Sistema de suscripción a newsletter
 */
export class NewsletterManager {
  constructor() {
    // Configuración Mailchimp
    // NOTA: Estos valores deben actualizarse con los valores reales de Mailchimp
    this.mailchimpConfig = {
      // Endpoint público de Mailchimp para suscripción
      // Formato: https://XXXXX.usXX.list-manage.com/subscribe/post?u=USER_ID&id=LIST_ID
      publicEndpoint: '', // TODO: Configurar con cuenta Mailchimp real
      
      // Estos valores se obtienen del formulario embedded de Mailchimp
      userId: '', // TODO: Configurar
      listId: ''  // TODO: Configurar
    };
    
    this.hasShownPopup = false;
  }

  /**
   * Suscribir email al newsletter
   */
  async subscribe(email, name = '', source = 'footer') {
    try {
      logger.debug('Newsletter', 'Attempting subscription', { email, source });
      
      // Validación
      if (!this.isValidEmail(email)) {
        throw new Error('Email inválido');
      }
      
      // Si no hay endpoint configurado, simular success
      if (!this.mailchimpConfig.publicEndpoint) {
        logger.warn('Newsletter', 'Mailchimp not configured, simulating subscription');
        
        // Guardar localmente para testing
        localStorage.setItem('newsletter_subscribed', 'true');
        localStorage.setItem('newsletter_email', email);
        
        // Track event
        this.trackSubscription(source);
        
        return { success: true, message: 'Suscripción simulada (Mailchimp pendiente de configuración)' };
      }
      
      // Submit real via JSONP (Mailchimp requirement)
      return new Promise((resolve, reject) => {
        const form = document.createElement('form');
        form.action = this.mailchimpConfig.publicEndpoint;
        form.method = 'POST';
        form.target = 'hidden-iframe-newsletter';
        
        // Email input
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'EMAIL';
        emailInput.value = email;
        form.appendChild(emailInput);
        
        // Name input (opcional)
        if (name) {
          const nameInput = document.createElement('input');
          nameInput.type = 'text';
          nameInput.name = 'FNAME';
          nameInput.value = name;
          form.appendChild(nameInput);
        }
        
        // Source tracking
        const sourceInput = document.createElement('input');
        sourceInput.type = 'hidden';
        sourceInput.name = 'SOURCE';
        sourceInput.value = source;
        form.appendChild(sourceInput);
        
        // Anti-bot field (honeypot)
        const botField = document.createElement('input');
        botField.type = 'text';
        botField.name = 'b_' + this.mailchimpConfig.userId + '_' + this.mailchimpConfig.listId;
        botField.style.position = 'absolute';
        botField.style.left = '-5000px';
        botField.setAttribute('aria-hidden', 'true');
        form.appendChild(botField);
        
        // Create hidden iframe
        let iframe = document.getElementById('hidden-iframe-newsletter');
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.name = 'hidden-iframe-newsletter';
          iframe.id = 'hidden-iframe-newsletter';
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
        }
        
        // Handle response
        iframe.onload = () => {
          // Guardar suscripción exitosa
          localStorage.setItem('newsletter_subscribed', 'true');
          localStorage.setItem('newsletter_email', email);
          localStorage.setItem('newsletter_date', new Date().toISOString());
          
          // Track event
          this.trackSubscription(source);
          
          logger.success('Newsletter', 'Subscription successful', { email, source });
          resolve({ success: true });
        };
        
        iframe.onerror = () => {
          logger.error('Newsletter', 'Subscription failed (iframe error)');
          reject(new Error('Error de red. Por favor intenta nuevamente.'));
        };
        
        // Submit form
        document.body.appendChild(form);
        form.submit();
        
        // Cleanup después de un delay
        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
        }, 1000);
      });
    } catch (error) {
      logger.error('Newsletter subscription error:', error);
      throw error;
    }
  }

  /**
   * Validar email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Verificar si debe mostrar popup
   */
  shouldShowPopup() {
    // No mostrar si:
    // 1. Ya está suscrito
    if (localStorage.getItem('newsletter_subscribed') === 'true') {
      logger.debug('Newsletter', 'Already subscribed, not showing popup');
      return false;
    }
    
    // 2. Ya vio el popup en esta sesión
    if (sessionStorage.getItem('popup_shown') === 'true') {
      logger.debug('Newsletter', 'Popup already shown in this session');
      return false;
    }
    
    // 3. Es mobile (mejor solo footer en mobile)
    if (window.innerWidth < 768) {
      logger.debug('Newsletter', 'Mobile device, not showing popup');
      return false;
    }
    
    // 4. Cerró el popup manualmente (respetamos su decisión por 7 días)
    const closedDate = localStorage.getItem('newsletter_popup_closed');
    if (closedDate) {
      const daysSinceClosed = (Date.now() - new Date(closedDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceClosed < 7) {
        logger.debug('Newsletter', 'Popup closed recently, respecting cooldown');
        return false;
      }
    }
    
    return true;
  }

  /**
   * Mostrar popup después de delay
   */
  showPopup(delay = 30000) {
    if (!this.shouldShowPopup()) return;
    
    logger.debug('Newsletter', `Popup will show in ${delay/1000}s`);
    
    // Delay de 30 segundos (configurable)
    setTimeout(() => {
      this.renderPopup();
      sessionStorage.setItem('popup_shown', 'true');
    }, delay);
  }

  /**
   * Renderizar popup
   */
  renderPopup() {
    // Verificar si ya existe
    if (document.getElementById('newsletter-popup')) return;
    
    const popup = document.createElement('div');
    popup.id = 'newsletter-popup';
    popup.className = 'newsletter-popup';
    popup.innerHTML = `
      <div class="popup-content glass-effect">
        <button class="popup-close" aria-label="Cerrar">×</button>
        <div class="popup-icon">
          <i class="fas fa-envelope-open-text text-5xl text-primary"></i>
        </div>
        <h3 class="popup-title">📬 The Data Digest</h3>
        <p class="popup-description">
          Recibe cada semana:<br>
          • <strong>3 noticias clave</strong> de Data & IA<br>
          • <strong>1 tip financiero</strong> para Argentina<br>
          • <strong>Acceso anticipado</strong> a nuevo contenido
        </p>
        <form id="popup-newsletter-form" class="popup-form">
          <input 
            type="email" 
            placeholder="tu@email.com" 
            required
            id="popup-email"
            class="popup-input">
          <button type="submit" class="btn-primary">
            Suscribirme Gratis
          </button>
        </form>
        <p class="privacy-note">
          <i class="fas fa-shield-alt mr-1"></i>
          Sin spam. Cancela cuando quieras.
        </p>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    // Event listeners
    popup.querySelector('.popup-close').addEventListener('click', () => {
      this.closePopup(popup);
    });
    
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        this.closePopup(popup);
      }
    });
    
    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.closePopup(popup);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Form submit
    popup.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = popup.querySelector('#popup-email').value;
      const submitBtn = popup.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Suscribiendo...';
        
        await this.subscribe(email, '', 'popup');
        
        // Success message
        popup.querySelector('.popup-content').innerHTML = `
          <div class="success-message text-center">
            <i class="fas fa-check-circle text-6xl text-green-400 mb-4"></i>
            <h3 class="text-2xl font-bold mb-2">¡Gracias por suscribirte!</h3>
            <p class="text-secondary">Revisa tu email para confirmar la suscripción.</p>
          </div>
        `;
        
        setTimeout(() => popup.remove(), 3000);
      } catch (error) {
        logger.error('Popup subscription error:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert(error.message || 'Error al suscribirse. Por favor intenta nuevamente.');
      }
    });
    
    logger.success('Newsletter', 'Popup displayed');
  }

  /**
   * Cerrar popup
   */
  closePopup(popup) {
    popup.classList.add('closing');
    
    // Guardar que cerró manualmente
    localStorage.setItem('newsletter_popup_closed', new Date().toISOString());
    
    setTimeout(() => {
      popup.remove();
    }, 300);
    
    logger.debug('Newsletter', 'Popup closed by user');
  }

  /**
   * Track subscription event in Google Analytics
   */
  trackSubscription(source) {
    if (typeof gtag === 'function') {
      gtag('event', 'newsletter_subscribe', {
        'event_category': 'conversion',
        'event_label': source,
        'value': 15 // Valor estimado de un suscriptor
      });
      logger.debug('Newsletter', 'Subscription tracked in GA', { source });
    }
  }

  /**
   * Verificar si está suscrito
   */
  isSubscribed() {
    return localStorage.getItem('newsletter_subscribed') === 'true';
  }

  /**
   * Obtener estadísticas de newsletter
   */
  getStats() {
    return {
      isSubscribed: this.isSubscribed(),
      email: localStorage.getItem('newsletter_email'),
      subscriptionDate: localStorage.getItem('newsletter_date')
    };
  }
}

// Create singleton instance
const newsletter = new NewsletterManager();

// Auto-initialize popup - DESACTIVADO temporalmente
// document.addEventListener('DOMContentLoaded', () => {
//   // Delay de 30 segundos antes de mostrar popup
//   newsletter.showPopup(30000);
// });

// Export
export default newsletter;
