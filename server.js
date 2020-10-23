const app = require('./app');

const { PORT } = require('./constants/constants');

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
