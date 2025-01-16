/* tslint:disable */
/* eslint-disable */
/**
 * Jupiter API v6
 * The core of [jup.ag](https://jup.ag). Easily get a quote and swap through Jupiter API.  ### Rate Limit We update our rate limit from time to time depending on the load of our servers. We recommend running your own instance of the API if you want to have high rate limit, here to learn how to run the [self-hosted API](https://station.jup.ag/docs/apis/self-hosted).  ### API Wrapper - Typescript [@jup-ag/api](https://github.com/jup-ag/jupiter-quote-api-node)  ### Data types - Public keys are base58 encoded strings - raw data such as Vec<u8\\> are base64 encoded strings 
 *
 * The version of the OpenAPI document: 6.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SwapResponsePrioritizationTypeJito
 */
export interface SwapResponsePrioritizationTypeJito {
    /**
     * 
     * @type {number}
     * @memberof SwapResponsePrioritizationTypeJito
     */
    lamports?: number;
}

/**
 * Check if a given object implements the SwapResponsePrioritizationTypeJito interface.
 */
export function instanceOfSwapResponsePrioritizationTypeJito(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SwapResponsePrioritizationTypeJitoFromJSON(json: any): SwapResponsePrioritizationTypeJito {
    return SwapResponsePrioritizationTypeJitoFromJSONTyped(json, false);
}

export function SwapResponsePrioritizationTypeJitoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SwapResponsePrioritizationTypeJito {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lamports': !exists(json, 'lamports') ? undefined : json['lamports'],
    };
}

export function SwapResponsePrioritizationTypeJitoToJSON(value?: SwapResponsePrioritizationTypeJito | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lamports': value.lamports,
    };
}

