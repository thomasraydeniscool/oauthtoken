import addSeconds from 'date-fns/addSeconds';
import parseISO from 'date-fns/parseISO';
import isDate from 'date-fns/isDate';
import isAfter from 'date-fns/isAfter';
import ow from 'ow';

// https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse
export interface TokenResponse {
  [key: string]: any;
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  token_type?: string;
}

export interface AccessTokenConfig {
  expiresProperty?: string;
}

export class AccessToken {
  private _token: TokenResponse;
  private expires: Date;

  constructor(token: TokenResponse, config: AccessTokenConfig = {}) {
    ow(config, ow.object.exactShape({ expiresProperty: ow.optional.string }));
    ow(
      token,
      ow.object.partialShape({
        access_token: ow.string,
        expires_in: ow.number,
        expires_at: ow.optional.string,
        refresh_token: ow.optional.string,
        id_token: ow.optional.string,
        token_type: ow.optional.string
      })
    );
    const { expiresProperty = 'expires_at' } = config;
    this._token = this.parseToken(token, expiresProperty);
    this.expires = this._token[expiresProperty];
  }

  public parseToken(token: TokenResponse, property: string) {
    let expires = addSeconds(
      new Date(),
      parseInt(String(token.expires_in), 10)
    );
    if (token[property]) {
      if (!isDate(token[property])) {
        expires = parseISO(String(token[property]));
      } else {
        expires = token[property];
      }
    }
    return { ...token, [property]: expires };
  }

  public get token() {
    return this._token;
  }

  public expired() {
    return isAfter(new Date(), this.expires);
  }
}
