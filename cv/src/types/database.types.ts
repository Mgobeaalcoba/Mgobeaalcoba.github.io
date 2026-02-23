/**
 * Supabase Database Types — generated from db/migrations/001_initial_schema.sql
 *
 * To regenerate via CLI (requires supabase access token):
 *   npx supabase gen types typescript --project-id fqdmnvbsbxgtjemlpwsm > src/types/database.types.ts
 *
 * Column names here are in snake_case — exactly as Supabase/PostgreSQL returns them.
 * The query functions in lib/queries/ map these to camelCase for components.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      // ── CV ──────────────────────────────────────────────────────────────────
      cv_meta: {
        Row: {
          id: number;
          name: string;
          title_es: string;
          title_en: string;
          email: string;
          phone: string | null;
          location: string | null;
          linkedin: string | null;
          github: string | null;
          twitter: string | null;
          calendly: string | null;
          ga4_id: string | null;
        };
      };
      cv_about: {
        Row: {
          id: number;
          title_es: string;
          title_en: string;
          text_es: string;
          text_en: string;
        };
      };
      cv_tech_stack_categories: {
        Row: {
          id: number;
          name: string;
          sort_order: number;
        };
      };
      cv_tech_stack_items: {
        Row: {
          id: number;
          category_id: number;
          item: string;
          sort_order: number;
        };
      };
      cv_consulting_meta: {
        Row: {
          id: number;
          headline_es: string;
          headline_en: string;
          subheadline_es: string;
          subheadline_en: string;
          calendly_url: string;
        };
      };
      cv_consulting_stats: {
        Row: {
          id: number;
          value: string;
          label_es: string;
          label_en: string;
          sort_order: number;
        };
      };
      cv_consulting_process_steps: {
        Row: {
          id: number;
          number: string;
          title_es: string;
          title_en: string;
          description_es: string;
          description_en: string;
          sort_order: number;
        };
      };
      // ── EXPERIENCE / PROJECTS / EDUCATION / CERTIFICATIONS ───────────────
      experience: {
        Row: {
          id: number;
          date_es: string;
          date_en: string;
          title_es: string;
          title_en: string;
          company: string;
          description_es: string;
          description_en: string;
          sort_order: number;
        };
      };
      experience_tags: {
        Row: {
          id: number;
          experience_id: number;
          tag: string;
        };
      };
      projects: {
        Row: {
          id: number;
          title_es: string;
          title_en: string;
          description_es: string;
          description_en: string;
          link: string | null;
          sort_order: number;
        };
      };
      project_tags: {
        Row: {
          id: number;
          project_id: number;
          tag: string;
        };
      };
      education: {
        Row: {
          id: number;
          title_es: string;
          title_en: string;
          school: string;
          date: string;
          subtitle_es: string | null;
          subtitle_en: string | null;
          sort_order: number;
        };
      };
      education_tags: {
        Row: {
          id: number;
          education_id: number;
          tag: string;
        };
      };
      certifications: {
        Row: {
          id: number;
          name: string;
          sort_order: number;
        };
      };
      certification_tags: {
        Row: {
          id: number;
          certification_id: number;
          tag: string;
        };
      };
      // ── CONSULTING ────────────────────────────────────────────────────────
      consulting_packs: {
        Row: {
          id: string;
          name_es: string;
          name_en: string;
          subtitle_es: string;
          subtitle_en: string;
          description_es: string;
          description_en: string;
          price_es: string;
          price_en: string;
          highlighted: boolean;
          badge_es: string | null;
          badge_en: string | null;
          sort_order: number;
        };
      };
      consulting_pack_features: {
        Row: {
          id: number;
          pack_id: string;
          text_es: string;
          text_en: string;
          sort_order: number;
        };
      };
      consulting_pack_automations: {
        Row: {
          id: number;
          pack_id: string;
          text_es: string;
          text_en: string;
          sort_order: number;
        };
      };
      consulting_case_studies: {
        Row: {
          id: string;
          title_es: string;
          title_en: string;
          description_es: string;
          description_en: string;
          result_es: string;
          result_en: string;
          image: string | null;
          sort_order: number;
        };
      };
      consulting_case_study_tags: {
        Row: {
          id: number;
          case_study_id: string;
          tag: string;
        };
      };
      // ── BLOG ─────────────────────────────────────────────────────────────
      blog_posts: {
        Row: {
          id: number;
          slug: string;
          file: string | null;
          title_es: string;
          title_en: string;
          excerpt_es: string | null;
          excerpt_en: string | null;
          date: string;
          category: string | null;
          featured: boolean;
          read_time: string | null;
          author: string | null;
          sort_order: number;
        };
      };
      blog_post_tags: {
        Row: {
          id: number;
          post_id: number;
          tag: string;
        };
      };
      blog_categories: {
        Row: {
          id: number;
          name: string;
          sort_order: number;
        };
      };
      // ── VIDEOS ───────────────────────────────────────────────────────────
      videos: {
        Row: {
          id: string;
          youtube_id: string;
          title_es: string;
          title_en: string;
          description_es: string | null;
          description_en: string | null;
          category: string | null;
          duration: string | null;
          date: string | null;
          channel: string | null;
          featured: boolean;
          sort_order: number;
        };
      };
      video_tags: {
        Row: {
          id: number;
          video_id: string;
          tag: string;
        };
      };
      // ── TAX CALCULATOR ───────────────────────────────────────────────────
      tax_calculator_params: {
        Row: {
          id: number;
          period: string;
          gni: string;
          deduccion_especial: string;
          conyuge: string;
          hijo: string;
          hijo_incapacitado: string;
          aportes_pct: string;
          aportes_base_min: string;
          aportes_base_max: string;
          alquiler_pct: string;
          alquiler_tope: string;
          hipotecario_tope: string;
          medicos_pct: string;
          gn_tope_pct: string;
          educacion_tope: string;
          seguro_vida_tope: string;
          sepelio_tope: string;
          updated_at: string;
        };
      };
      tax_scale_brackets: {
        Row: {
          id: number;
          params_id: number;
          bracket_order: number;
          limit_amount: string;
          fixed_amount: string;
          pct: string;
        };
      };
      tax_scenarios: {
        Row: {
          id: number;
          label_es: string;
          label_en: string;
          salary_label_es: string | null;
          salary_label_en: string | null;
          gross_salary: string;
          conyuge: boolean;
          hijos: number;
          hijos_incap: number;
          alquiler: string;
          alquiler_anual: boolean;
          extra_income: string;
          include_sac: boolean;
          color_class: string | null;
          sort_order: number;
        };
      };
      tax_tabs: {
        Row: {
          id: number;
          tab_id: string;
          label_es: string;
          label_en: string;
          title_es: string;
          title_en: string;
          content_es: string;
          content_en: string;
          formula_es: string | null;
          formula_en: string | null;
          sort_order: number;
        };
      };
      plazo_fijo_rates: {
        Row: {
          id: number;
          period: string;
          monthly_rate: string;
        };
      };
      // ── AI MODELS ────────────────────────────────────────────────────────
      ai_models: {
        Row: {
          id: number;
          name: string;
          provider: string;
          input_per_1m: string;
          output_per_1m: string;
          color_class: string | null;
          sort_order: number;
        };
      };
      // ── NEIL SITE ─────────────────────────────────────────────────────────
      neil_config: {
        Row: {
          id: number;
          meta: Json;
          brand: Json;
          hero: Json;
          flags: Json;
          pre_cooling: Json;
          europe: Json;
          contact: Json;
          footer: Json;
          automations: Json;
          sales_proposal: Json;
        };
      };
      neil_product_categories: {
        Row: {
          id: string;
          sort_order: number;
        };
      };
      neil_product_models: {
        Row: {
          id: number;
          category_id: string;
          name: string;
          description: string | null;
          image: string | null;
          features: Json;
          sort_order: number;
        };
      };
      neil_translations: {
        Row: {
          id: number;
          lang: string;
          key: string;
          value: string;
        };
      };
      // ── EL PORTUGUÉS SITE ─────────────────────────────────────────────────
      ep_config: {
        Row: {
          id: number;
          meta: Json;
          brand: Json;
          hero: Json;
          about: Json;
          services: Json;
          quality: Json;
          values_section: Json;
          contact: Json;
          footer: Json;
          automations: Json;
          sales_proposal: Json;
        };
      };
      ep_history_timeline: {
        Row: {
          id: number;
          year: string;
          event_es: string | null;
          event_en: string | null;
          sort_order: number;
        };
      };
      ep_history_gallery: {
        Row: {
          id: number;
          image_url: string;
          sort_order: number;
        };
      };
    };
  };
}

/** Convenience type to extract a table's Row type */
export type TableRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
