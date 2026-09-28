const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Injection globale absolue pour corriger le crash DOMException de Hermes sur iOS
global.DOMException = class DOMException extends Error {
  constructor(message = 'The operation was aborted', name = 'DOMException') {
    super(message);
    this.name = name;
  }
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
