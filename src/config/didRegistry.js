// DIDRegistry contract ABI for backend/frontend integration
export const DID_REGISTRY_ABI = [
  {"type":"function","name":"dids","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},
  {"type":"function","name":"getDID","inputs":[{"name":"user","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},
  {"type":"function","name":"registerDID","inputs":[{"name":"did","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"event","name":"DIDCreated","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"did","type":"string","indexed":false,"internalType":"string"}],"anonymous":false}
];

export const DID_REGISTRY_ADDRESS = "0x3B665dC70eC2b6A276E4b9535A5B46411f32B1dA";
