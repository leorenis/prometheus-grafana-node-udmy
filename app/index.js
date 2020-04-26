const express = require('express')
const client = require('prom-client')
const app = express()

// Counter
const counter = new client.Counter({
  name: 'class_request_counter',
  help: 'Request counter by Leo R Santos.',
  labelNames: ['statusCode']
})
// counter.inc(10) // Inc with 10

// Gauhe -> Calibre
const gauge = new client.Gauge({
    name: 'class_free_bytes',
    help: 'ramdom number to simulate the free bytes. Its just an exemple.',
});

// Histogram
const histogram = new client.Histogram({
    name: 'class_request_time_seconds',
    help: 'Response time API',
    buckets: [0.1, 0.2, 0.3, 0.4, 0.5],
  });

const summary = new client.Summary({
    name: 'class_request_time_seconds_summary',
    help: 'Summary help',
    percentiles: [0.5, 0.9, 0.99],
})

app.get('/', (req, res) => {
    counter.labels('200').inc()
    gauge.set(100*Math.random())
    const responseTime = Math.random()
    histogram.observe(responseTime)
    summary.observe(responseTime)
    
    res.send('App exemple, app for instrumentation prometheus app.')
})

app.get('/metrics', (req, res) => {
    res.set('Content-Type', client.register.contentType)
    res.end(client.register.metrics())
})

app.listen(3000)