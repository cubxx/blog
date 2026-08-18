## 呈现时长误差 $E_n = |t_n - t_e|$

$t$ 表示实际帧时刻，$t_e$ 表示期望帧时刻，而 $t_e-t_0$ 就是期望呈现时长。
为了让误差最小，需要满足 $E_n < E_{n-1}$ 和 $E_n \le E_{n+1}$ 。

由于从 $t_0$ 开始逐帧判断是否终止呈现，说明在对 $t_n$ 判断前已经证明了 $E_n < E_{n-1}$ ，即：
$$\frac{t_{n-1}+t_n}{2} < t_e$$

所以判断终止只需要满足 $E_n \le E_{n+1}$，即：
$$t_e \le \frac{t_{n+1}+t_n}{2} $$

## 帧时长误差 $\delta_n = |\Delta_n - \Delta_n'|$

当前帧时长 $\Delta_n = t_{n+1} - t_n$ 无法在 $t_n$ 时刻得知，所以只能使用预测值 $\Delta_n'$ 进行估计。

终止条件可转化为：
$$2(t_e-t_n) \le \Delta_n$$

$\Delta_n'$ 对 $E_n$ 的影响只有两种错误判断情况：

- 不终止 $\Delta_n'<2(t_e-t_n) \le \Delta_n$
- 提前终止 $\Delta_n<2(t_e-t_n) \le \Delta_n'$

两种情况的 $E$ 增量都是 $|E_{n+1}-E_n| = t_{n+1}+t_n-2t_e$ 。

错误发生条件可以简化为 $|2(t_e-t_n)-\Delta_n| \le \delta_n$ ，这表明 $|2(t_e-t_n)-\Delta_n|$ 是 $\delta_n$ 触发错误的阈值。
