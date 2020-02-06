export default function validationDictionary(t) {
  return {
    firstName: {
      presence: { allowEmpty: false, message: t('IS_REQUIRED') },
      length: {
        maximum: 32
      }
    },
    lastName: {
      presence: { allowEmpty: false, message: t('IS_REQUIRED') },
      length: {
        maximum: 32
      }
    },
    email: {
      presence: { allowEmpty: false, message: t('IS_REQUIRED') },
      email: true,
      length: {
        maximum: 64
      }
    },
    password: {
      presence: { allowEmpty: false, message: t('IS_REQUIRED') },
      length: {
        maximum: 128
      }
    },
    cellPhone: {

      cust: 'some options',
      presence: { allowEmpty: false, message: t('IS_REQUIRED') },
      length: {
        maximum: 20
      }
    },
    countryCell: {
      type: 'integer',
      presence: { allowEmpty: false, message: t('IS_REQUIRED') },
    },
    policy: {
      presence: { allowEmpty: false, message: t('IS_REQUIRED') },
      checked: true
    }
  };
}
