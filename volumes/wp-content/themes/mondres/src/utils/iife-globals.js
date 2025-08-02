export default function setGlobal(namespace, key, value) {
  window[namespace] = window[namespace] || {};
  window[namespace][key] = value;
}