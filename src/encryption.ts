/**
 * Implementation of symmetric encryption/decryption of string values. Blatantly ripped off from:
 * @see https://embed.plnkr.co/0VPU1zmmWC5wmTKPKnhg/
 *
 * Which is largely based on:
 * @see https://cryptojs.gitbook.io/docs
 */

import CryptoJS from 'crypto-js';

const KEY_SIZE = 256;
const ITERATIONS = 100;

function _encrypt(value: string, secret: string): string {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2(secret, salt, {
    keySize: KEY_SIZE / 32,
    iterations: ITERATIONS,
  });
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const padding = CryptoJS.pad.Pkcs7;
  const mode = CryptoJS.mode.CBC;

  const encrypted = CryptoJS.AES.encrypt(value, key, { iv, padding, mode });
  const message = `${salt.toString()}${iv.toString()}${encrypted.toString()}`;
  return message;
}

function _decrypt(message: string, secret: string): string {
  const salt = CryptoJS.enc.Hex.parse(message.substr(0, 32));
  const iv = CryptoJS.enc.Hex.parse(message.substr(32, 32));
  const encrypted = message.substring(64);

  const key = CryptoJS.PBKDF2(secret, salt, {
    keySize: KEY_SIZE / 32,
    iterations: ITERATIONS,
  });

  const padding = CryptoJS.pad.Pkcs7;
  const mode = CryptoJS.mode.CBC;

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv, padding, mode });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Symmetrically encrypt any string value with AES-256 using a runtime secret as a passphrase.
 *
 * @param value Value to encrypt.
 * @param secret Key/shared secret.
 * @returns AES cipher text which can be used to decrypt the original value.
 */
export function encrypt(value: string, secret: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof value !== 'string') {
      reject(TypeError('Value passed to encrypt function must be a string'));
    }
    try {
      resolve(_encrypt(value, secret));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Symmetrically decrypt any string value with AES-256 using a runtime secret as a passphrase.
 *
 * @param message AES cipher text.
 * @param secret Key/shared secret.
 * @returns Original decrypted value.
 */
export function decrypt(message: string, secret: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof message !== 'string') {
      reject(TypeError('Value passed to decrypt function must be a string'));
    }
    try {
      resolve(_decrypt(message, secret));
    } catch (err) {
      reject(err);
    }
  });
}
