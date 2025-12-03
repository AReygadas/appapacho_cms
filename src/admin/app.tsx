// src/admin/app.tsx

// Si tienes el logo y el favicon, colócalos en:
// src/admin/extensions/logo-appapacho.png
// src/admin/extensions/favicon-appapacho.png
// y descomenta las líneas de import 👇

// import LogoAppapacho from './extensions/logo-appapacho.png';
// import FaviconAppapacho from './extensions/favicon-appapacho.png';
import './extensions/custom.scss';
import observeAndCollapseUpgradeBanners from './extensions/remove-upgrade';
export default {
  config: {
    // 🌍 Locales disponibles en el panel
    locales: ['es', 'en'],

    // 🧭 Desactivar tutoriales y avisos de releases
    tutorials: false,
    notifications: { releases: false },

    // 🖼️ Logos (login + sidebar)
    auth: {
      // logo: LogoAppapacho,
    },
    menu: {
      // logo: LogoAppapacho,
    },

    // 🔖 Favicon
    head: {
      // favicon: FaviconAppapacho,
    },

    // 🎨 Tema Appapacho
    theme: {
      // 🌞 MODO CLARO
      light: {
        colors: {
          // Primarios (tu degradado rosa)
          primary100: 'rgba(255, 203, 198, 1)',
          primary200: 'rgba(255, 177, 169, 1)',
          primary300: 'rgba(255, 152, 141, 1)',
          primary500: 'rgba(255, 126, 112, 1)',
          primary600: 'rgba(255, 110,  96, 1)',
          primary700: 'rgba(230,  90,  78, 1)',

          // Fondo general y tarjetas
          neutral0: '#FFFFFF',      // fondo principal
          neutral100: '#FFF5F3',    // fondos suaves (cards, inputs)
          neutral200: '#FFE4DE',
          neutral500: '#9A6F6A',    // textos secundarios
          neutral800: '#4A2E2B',    // textos principales

          // Estados
          success500: '#2ecc71',
          warning500: '#f1c40f',
          danger500: '#e74c3c',

          // Bordes / focus
          primaryFocus: 'rgba(255, 126, 112, 0.45)',
        },
      },

      // 🌚 MODO OSCURO
      dark: {
        colors: {
          // Fondo oscuro tirando a vino/café para que combine con el rosa
          neutral0: '#2e2c2cff',      // fondo principal
          neutral100: '#000000ff',    // cards
          neutral200: '#2A1717',
          neutral500: '#E3C4BF',    // textos secundarios
          neutral800: '#FFE8E2',    // textos principales
          
          // Primarios: mantenemos tu degradado rosa pero más intenso
          primary100: 'rgba(255, 203, 198, 1)',
          primary200: 'rgba(255, 177, 169, 1)',
          primary300: 'rgba(255, 152, 141, 1)',
          primary500: 'rgba(255, 126, 112, 1)',
          primary600: 'rgba(255, 140, 120, 1)',
          primary700: 'rgba(255, 160, 135, 1)',

          success500: '#27ae60',
          warning500: '#f39c12',
          danger500: '#e74c3c',

          primaryFocus: 'rgba(255, 177, 169, 0.5)',
        },
      },
    },
  },
  
 bootstrap() {
 if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          observeAndCollapseUpgradeBanners();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Error arrancando observer de banners', e);
        }
      }, 250);
    }
  },
};