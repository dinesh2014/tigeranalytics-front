const calendarTranspile = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
]);

const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboards/healthcare',
        destination: '/dashboards/healthcare/doctor'
      },
      {
        source: '/dashboards',
        destination: '/dashboards/reports'
      },
      {
        source: '/applications',
        destination: '/applications/file-manager'
      },
      {
        source: '/blocks',
        destination: '/blocks/charts-large'
      },
      {
        source: '/management',
        destination: '/management/users'
      }
    ];
  }
};

module.exports = withImages(
  calendarTranspile({
    i18n: {
      defaultLocale: 'en',
      locales: ['en']
    },
    redirects
  })
);

