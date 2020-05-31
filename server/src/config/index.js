export default {
  secret:
    process.env.NODE_ENV === 'production'
      ? process.env.SECRECT
      : 'AINFOAIS@$!#QWE121aposiapsgnoasgo1244125NsofIASFBIO@$!%!iBUFUF',
  api:
    process.env.NODE_ENV === 'production'
      ? 'https://api.loja-test.ampliee.com'
      : 'http://localhost:3333',

  loja:
    process.env.NODE_ENV === 'production'
      ? 'https://loja-test.ampliee.com'
      : 'http://localhost:8000',
};
