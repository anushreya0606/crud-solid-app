// S: Single Responsibility — only generates IDs
const IdGenerator = {
  generate: () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
};

export default IdGenerator;
