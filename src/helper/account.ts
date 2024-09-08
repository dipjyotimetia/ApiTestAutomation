interface Account {
  request: {
    baseCurrency: string;
    accounts: {
      accountToken: string;
    }[];
  };
}

const account: Account = {
  request: {
    baseCurrency: "AUD",
    accounts: [
      {
        accountToken:
          "obFyWwLGTN2Xk8tZ_Gr40nJXn98Lez2Geppx4MOjLCOTTLBhjLsmWE_aVliknvbv"
      }
    ]
  }
};

export default account;
