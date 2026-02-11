// newsletter.js - Newsletter subscription system "The Data Digest"
// Modified to use n8n webhook instead of Mailchimp
import logger from './logger.js';

/**
 * NewsletterManager - Sistema de suscripción a newsletter con n8n
 */
export class NewsletterManager {
  constructor() {
    // Configuración n8n webhook
    this.webhookConfig = {
      endpoint: 'https://mgobeaalcoba.app.n8n.cloud/webhook/recibir-email',
      timeout: 10000 // 10 segundos timeout
    };
    
    this.hasShownPopup = false;
    
    logger.debug('Newsletter', 'Initialized with n8n webhook:', this.webhookConfig.endpoint);
  }

  /**
   * Suscribir email al newsletter via n8n webhook
   */
  async subscribe(email, name = '', source = 'footer') {
    try {
      logger.debug('Newsletter', 'Attempting subscription', { email, source });
      
      // Validación
      if (!this.isValidEmail(email)) {
        throw new Error('Email inválido. Por favor verifica el formato.');
      }
      
      // Preparar payload para n8n
      const payload = {
        email: email,
        name: name || '',
        source: source,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: document.documentElement.lang || 'es'
      };
      
      logger.debug('Newsletter', 'Sending to n8n webhook', payload);
      
      // Enviar POST a n8n webhook
      const response = await fetch(this.webhookConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.webhookConfig.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }
      
      // Intentar parsear respuesta
      let responseData;
      try {
        responseData = await response.json();
        logger.debug('Newsletter', 'n8n response:', responseData);
      } catch (e) {
        // Si no es JSON, está ok (n8n puede devolver texto plano)
        logger.debug('Newsletter', 'n8n response (non-JSON):', await response.text());
        responseData = { success: true };
      }
      
      // Guardar suscripción exitosa en localStorage
      localStorage.setItem('newsletter_subscribed', 'true');
      localStorage.setItem('newsletter_email', email);
      localStorage.setItem('newsletter_date', new Date().toISOString());
      localStorage.setItem('newsletter_source', source);
      
      // Track event en analytics
      this.trackSubscription(source, email);
      
      logger.success('Newsletter', 'Subscription successful via n8n', { email, source });
      
      return { 
        success: true, 
        message: '¡Suscripción exitosa! Recibirás "The Data Digest" cada semana.',
        data: responseData 
      };
      
    } catch (error) {
      logger.error('Newsletter subscription error:', error);
      
      // Mensajes de error específicos
      if (error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado. Por favor intenta nuevamente.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
      } else {
        throw new Error(error.message || 'Error al suscribirse. Por favor intenta nuevamente.');
      }
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
            <p class="text-secondary">Recibirás "The Data Digest" cada semana en tu email.</p>
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
  trackSubscription(source, email) {
    if (typeof gtag === 'function') {
      // Track newsletter signup
      gtag('event', 'newsletter_signup', {
        'event_category': 'engagement',
        'event_label': source,
        'method': source,
        'page': window.location.pathname,
        'value': 20 // Valor estimado de un suscriptor
      });
      
      // Track as lead generation
      gtag('event', 'generate_lead', {
        'currency': 'USD',
        'value': 20,
        'lead_source': 'newsletter',
        'source': source
      });
      
      logger.debug('Newsletter', 'Subscription tracked in GA', { source, email });
    } else {
      logger.warn('Newsletter', 'Google Analytics not available for tracking');
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
