/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Resolves when the amount of time specified by delay has elapsed.
 */
export async function wait(delay) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

/**
 * Calls the given callback, retrying if it rejects or throws an error.
 * The delay between attempts increases per-try.
 *
 * @param {function} callback Function to call
 * @param {number} maxRetries Number of times to try calling
 * @param {number} delayFactor Multiplier for delay increase per-try
 * @param {number} initialDelay Initial delay in milliseconds
 */
export async function retry(callback, maxRetries = 5, delayFactor = 2, initialDelay = 1000) {
  /* eslint-disable no-await-in-loop */
  let delay = initialDelay;
  let lastError = null;
  for (let k = 0; k < maxRetries; k++) {
    try {
      // If we don't await here, the callback's promise will be returned
      // immediately instead of potentially failing.
      return await callback();
    } catch (err) {
      lastError = err;
      await wait(delay);
      delay *= delayFactor;
    }
  }
  throw lastError;
}

/**
 * Search a list for the maximum value. The key function is used to extract
 * the comparison key, and returns the values in the list by default.
 * @param  {array} collection
 * @param  {function} key
 */
export function findMax(collection, key = a => a) {
  if (collection.length < 1) {
    return null;
  }

  let max = collection[0];
  for (let k = 1; k < collection.length; k++) {
    if (key(collection[k]) > key(max)) {
      max = collection[k];
    }
  }

  return max;
}

/**
 * Parse a string containing a price to the currency amount in sub-units (e.g.
 * cents).
 *
 * Strings of the form "$10.00" are the only supported format for now.
 *
 * @param  {string} priceString
 * @return {number}
 */
export function priceStringToAmount(priceString) {
  const priceMatch = priceString.trim().match(/^\$([0-9]+)\.([0-9]{2})$/);
  return (Number.parseInt(priceMatch[1], 10) * 100) + Number.parseInt(priceMatch[2], 10);
}
