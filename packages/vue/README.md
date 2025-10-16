# tsichart-vue

Vue 3 components for TSIChart - Time Series Interactive Charts.

## Installation

```bash
npm install tsichart-vue tsichart-core
```

## Usage

```vue
<template>
  <LineChart :data="data" :options="options" @render="onRender" />
</template>

<script setup>
import { LineChart } from 'tsichart-vue';
import 'tsichart-core/styles';

const data = ref([/* your time series data */]);
const options = ref({/* chart options */});

const onRender = () => {
  console.log('Chart rendered');
};
</script>
```

## Coming Soon

This package is currently under development. Full documentation will be available soon.

## License

MIT © Alex Sysoiev
