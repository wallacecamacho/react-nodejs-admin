export default function validationDictionary(t) {
  return {
    firstName: {
      presence: { allowEmpty: false, message: t },
      length: {
        maximum: 32
      }
    },
    lastName: {
      presence: { allowEmpty: false, message: t },
      length: {
        maximum: 32
      }
    },
    email: {
      presence: { allowEmpty: false, message: t },
      email: true,
      length: {
        maximum: 64
      }
    },
    password: {
      presence: { allowEmpty: false, message: t },
      length: {
        maximum: 128
      }
    },
    cellPhone: {

      cust: 'some options',
      presence: { allowEmpty: false, message: t },
      length: {
        maximum: 20
      }
    },
    countryCell: {
      type: 'string',
      presence: { allowEmpty: false, message: t },
    },
    policy: {
      presence: { allowEmpty: false, message: t },
      checked: true
    }
  };
}
