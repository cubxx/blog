- [Google ML Crash Course](https://developers.google.com/machine-learning)

## Stochastic Approximation, SA, 随机近似

在不知道方程表达式的情况下，通过随机采样来求解或优化方程。

### Robbins-Monro, RM

RM 的思想是用函数输出值控制调参幅度。
要想求解包含未知函数的方程 $g(w)=0$，可以对 $w$ 进行迭代逼近：

$$
\begin{aligned}
w_{k+1}=w_k-\alpha_k&\tilde{g}(w_k,\eta_k),\quad k=1,2,3,\cdots\\
&\tilde{g}(w_k,\eta_k)=g(w_k)+\eta_k
\end{aligned}
$$

其中 $\alpha_k$ 表示学习率，$\eta_k$ 表示噪音。该算法使用条件：

- $\eta_k$ 期望值为 0 且 $\eta_k$ 不为无穷。其对应的噪音分布可以不是高斯分布。
- 对于任意 $w$，$0<c_1\leq\nabla_w g(w)\leq c_2$。说明 $g(w)$ 需要单调递增且导数不趋近无穷大。
- $\sum_{k=1}^\infty \alpha_k^2<\infty$ 表示 $\alpha_k\to 0$，否则 $w$ 不会收敛。
- $\sum_{k=1}^\infty \alpha_k=\infty$ 表示 $\alpha_k$ 不应收敛太快，以保证从任意初始值开始都能收敛。

### Gradient Descent, GD, 梯度下降

梯度下降的思想是用函数梯度控制调参幅度。
其目的是找到参数 $w$ 使 $J(w)=\mathbb{E}[f(w,X)]$ 达到最小值，其中 $X$ 是已知分布的随机变量。

考虑基本梯度下降 GD：

$$
\begin{aligned}
w_{k+1}&=w_k-\alpha_k\nabla_w J(w_k)\\
&=w_k-\alpha_k\nabla_w\mathbb{E}[f(w,X)]\\
&=w_k-\alpha_k\mathbb{E}[\nabla_w f(w,X)]
\end{aligned}
$$

可以发现这里需要求 $f(w,X)$ 函数梯度的期望值，即需要知道函数表达式。如果表达式未知，则进行多次采样求均值作为梯度期望估计值。考虑批量梯度下降 BGD：

$$w_{k+1}=w_k-\alpha_k\frac{1}{n}\sum_{i=1}^n\nabla_w f(w_k, x_i)$$

如果从已有样本中进行二次采样，则得到小批量梯度下降 MBGD：

$$w_{k+1}=w_k-\alpha_k\frac{1}{m}\sum_{j=1}^m\nabla_w f(w_k,x_j)$$

如果只采样一次，采样得到的梯度称为随机梯度，则得到随机梯度下降 SGD：

$$w_{k+1}=w_k-\alpha_k\nabla_w f(w_k,x_k)$$

:::details $w_k$ 与真值 $w^*$ 相距较远时，随机梯度更接近 $w_k$ 的梯度期望值；相距较近时，随机梯度表现出更大的随机性。

考虑随机梯度与实际梯度的相对误差：

$$\delta_k=\frac{|\nabla_w f(w_k,x_k)-\mathbb{E}[\nabla_w f(w_k,X)]|}{|\mathbb{E}[\nabla_w f(w_k,X)]|}$$

因为 $\mathbb{E}[\nabla_w f(w^*,X)]=0$，所以：

$$
\begin{aligned}
|\mathbb{E}[\nabla_w f(w_k,X)]|&=|\mathbb{E}[\nabla_w f(w_k,X)]-\mathbb{E}[\nabla_w f(w^*,X)]|\\
&=|\mathbb{E}[\nabla_w^2 f(\tilde{w_k},X)(w_k-w^*)]|,\quad \tilde{w_k}\in [w_k,w^*]\\
&=|\mathbb{E}[\nabla_w^2 f(\tilde{w_k},X)]|\cdot|w_k-w^*|\\
&\geq c|w_k-w^*|,\quad\text{when}\quad\nabla_w^2 f(\tilde{w_k},X)\geq c>0\\
\end{aligned}
$$

代入相对误差公式，得到：

$$\delta_k\leq\frac{|\nabla_w f(w_k,x_k)-\mathbb{E}[\nabla_w f(w_k,X)]|}{c|w_k-w^*|}$$

其中 $|w_k-w^*|$ 表示当前 $w$ 估计值到真值的距离，由公式可知这个距离与相对误差 $\delta_k$ 近似成反比。
:::
