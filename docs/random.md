---
editLink: false
lastUpdated: false
---

<script setup>
import { useRouter, withBase } from 'vitepress'
import { data } from './routes.data.ts'

const routes = data.map(e => e.url).filter(e => !['/', '/random'].includes(e));
const randomRoute = routes[Math.floor(Math.random() * routes.length)];
const content = randomRoute
    ? useRouter().go(withBase(randomRoute))
    : {
        msg: 'Error',
        data: Array.isArray(data) ? (data.length > 0 || 'empty arr') : 'not arr',
        routes: Array.isArray(routes) ? (routes.length > 0 || 'empty arr') : 'not arr',
        randomRoute: typeof randomRoute === 'string' ? randomRoute : 'not str',
    };
</script>
<pre>{{ content }}</pre>
