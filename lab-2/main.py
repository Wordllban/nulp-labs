import matplotlib.pyplot as plt

NUMBER_OF_ITERATIONS = 10
n = 5
m = 2


def calculate_payoff_a(matrix, empirical_vector):
    results = []

    for i in range(n):
        payoff_sum = 0
        for j in range(m):
            payoff_sum += matrix[i][j] * empirical_vector[j]
        results.append(payoff_sum)

    return max(results), results.index(max(results))


def calculate_payoff_b(matrix, empirical_vector):
    results = []

    for j in range(m):
        payoff_sum = 0
        for i in range(n):
            payoff_sum += matrix[i][j] * empirical_vector[i]
        results.append(payoff_sum)

    return min(results), results.index(min(results))


def brown_robinson(matrix, i, j):
    results = []

    p = [1 if p == i else 0 for p in range(n)]
    q = [1 if q == j else 0 for q in range(m)]

    for N in range(NUMBER_OF_ITERATIONS):
        a, i = calculate_payoff_a(matrix, q)
        b, j = calculate_payoff_b(matrix, p)
        p = [(p[item] * N + 1) / (N + 1) if item ==
             i else (p[item] * N) / (N + 1) for item in range(n)]
        q = [(q[item] * N + 1) / (N + 1) if item ==
             j else (q[item] * N) / (N + 1) for item in range(m)]
        v = (a + b) / 2
        results.append(v)

    return results


if __name__ == '__main__':
    matrix = [[5, 3],
              [-4, 5],
              [-3, 1],
              [-2, -4],
              [-1, 0]]

    first_strategy = 0
    second_strategy = 0

    result = brown_robinson(matrix, first_strategy, second_strategy)
    for index, item in enumerate(result):
        print(f"{index}: {item}")

    plt.plot([i for i in range(NUMBER_OF_ITERATIONS)], result)
    plt.show()
