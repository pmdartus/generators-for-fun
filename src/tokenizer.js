const TOKEN_TYPES = {
  NUMBER: "#number",
  PLUS: "+",
  MINUS: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  L_PAREN: "(",
  R_PAREN: ")",
};

class Tokenizer {
  #index = 0;
  #source;

  constructor(source) {
    this.#source = source;
  }

  *tokenize() {
    while (this.#index < this.#source.length) {
      while (this.#match(" ")) {
        // Ignore whitespace
      }

      if (this.#index >= this.#source.length) {
        break;
      }

      const char = this.#consume();
      switch (char) {
        case "+": {
          yield this.#createToken(TOKEN_TYPES.PLUS);
          break;
        }
        case "-": {
          yield this.#createToken(TOKEN_TYPES.MINUS);
          break;
        }
        case "*": {
          yield this.#createToken(TOKEN_TYPES.MULTIPLY);
          break;
        }
        case "/": {
          yield this.#createToken(TOKEN_TYPES.DIVIDE);
          break;
        }
        case "(": {
          yield this.#createToken(TOKEN_TYPES.L_PAREN);
          break;
        }
        case ")": {
          yield this.#createToken(TOKEN_TYPES.R_PAREN);
          break;
        }
        default: {
          if (char.match(/[0-9]/)) {
            let value = char;
            while (this.#peek() && this.#peek().match(/[0-9]/)) {
              value += this.#consume();
            }
            yield this.#createToken(TOKEN_TYPES.NUMBER, value);
          } else {
            throw new Error(`Unexpected character: ${char}`);
          }
        }
      }
    }
  }

  #consume() {
    return this.#source[this.#index++];
  }

  #peek() {
    return this.#source[this.#index];
  }

  #match(char) {
    const match = this.#peek() === char;
    if (match) {
      this.#consume();
    }
    return match;
  }

  #createToken(type, value) {
    return { type, value };
  }
}

const values =  [
  "",
  "   ",
  "1 + 2",
  "1 + 2 * 3",
  "( 1 + 2 ) * 3",
  " 1   ",
]

for (const value of values) {
  console.log(`Tokenizing "${value}"`);
  const tokenizer = new Tokenizer(value);
  for (const token of tokenizer.tokenize()) {
    console.log(token);
  }
}
