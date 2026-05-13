import http from 'k6/http';
import { Trend, Rate, Counter } from 'k6/metrics';
import { sleep, check } from 'k6';

export let GetPagedDuration = new Trend('get_paged_duration');
export let GetPagedFail = new Rate('get_paged_fail_rate');
export let GetPagedSuccessRate = new Rate('get_paged_success_rate');
export let GetPagedReqs = new Counter('get_paged_success_reqs');

export default function () {
    let response = http.get('http://test.k6.io');

    GetPagedDuration.add(response.timings.duration);
    GetPagedFail.add(response.status === 0 || response.status >= 400);
    GetPagedSuccessRate.add(response.status !== 0 && response.status < 400);

    if (response.status !== 0 && response.status < 400) {
        GetPagedReqs.add(1);
    }

    check(response, {
        'response time < 5000ms': (r) => r.timings.duration < 5000,
    });

    sleep(1);
}
