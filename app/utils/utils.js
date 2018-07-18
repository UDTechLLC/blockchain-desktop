/**
 * util function for updating object
 * @param oldObject {Object}
 * @param updatedProperties {Object}
 * @returns {Object}
 */
const updateObject = (oldObject, updatedProperties) => (
  {
    ...oldObject,
    ...updatedProperties
  }
);

/**
 * turn base64 string to blob object
 * @param b64string
 * @returns {Blob}
 */
const b64toBlob = b64string => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(b64string.split(',')[1]);

  // separate out the mime component
  const mimeString = b64string.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], { type: mimeString });
};

export {
  updateObject,
  b64toBlob,
};