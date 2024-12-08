
export default class Utils {

    static generateUUID() {
        // Check if the browser supports crypto API
        if (typeof crypto === 'object' && typeof crypto.getRandomValues === 'function') {
            const bytes = new Uint8Array(16);
            crypto.getRandomValues(bytes);

            // Set the version to 4
            bytes[6] = (bytes[6] & 0x0f) | 0x40;
            // Set the variant to RFC 4122
            bytes[8] = (bytes[8] & 0x3f) | 0x80;

            const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'));
            return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
        } else {
            throw new Error('crypto.getRandomValues is not supported in this environment.');
        }
    }
}