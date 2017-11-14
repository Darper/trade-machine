const express = require('express');
const fs = require('fs');
const app = express();
const request = require('request');

app.set('port', (process.env.API_PORT || 3001));

app.get('/api/rosters', (req, res) => {

  request({
    uri: 'https://www.parsehub.com/api/v2/projects/tN2CgU3QsD-t/last_ready_run/data',
    method: 'GET',
    gzip: true,
    qs: {
      api_key: "tTyawwH1NEZr",
      format: "json"
    }
  }, function(err, resp, body) {
    res.json(body);
  });
});

export default app;
