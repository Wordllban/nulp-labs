from operator import itemgetter
from typing import (
    Tuple,
    List,
    Callable,
    Set,
)


import numpy as np
from matplotlib import pyplot as plt
from shapely.geometry import LineString


class Plotter:
    @classmethod
    def plot(cls, is_2xn_matrix_game: bool, best_strategy: tuple, lines_y_coordinates: List) -> None:
        highest_y = max(max(lines_y_coordinates, key=itemgetter(1)))

        plt.figure(1)
        plt.title(
            f'Графоаналітичний метод: {"2xN" if is_2xn_matrix_game else "Mx2"}')

        best_strategy_x, best_strategy_y = best_strategy

        for i, y in enumerate(lines_y_coordinates, start=1):
            plt.plot((0, 1), y)

        plt.plot(
            (best_strategy_x, best_strategy_x), (0, best_strategy_y),
            color='pink', linestyle=':'
        )
        plt.plot(best_strategy_x, best_strategy_y, marker='o', color='red')

        plt.xlabel("x" if is_2xn_matrix_game else "y")
        plt.ylabel("y" if is_2xn_matrix_game else "x")

        plt.xlim(left=-0.0, right=1.0)
        plt.ylim(bottom=-10)
        plt.yticks(np.arange(highest_y + 1, step=5))
        plt.xticks(np.arange(11) / 10)
        plt.grid()
        plt.show()


class GraphAnalyticalMethodRunner:

    def __init__(self, game_model: np.ndarray = None) -> None:
        self.game_model = game_model
        self.is_2xn_matrix_game = False

    def generate_matrix(self, rows: int, cols: int, lower_limit: int,
                        upper_limit: int) -> None:
        self.game_model = np.random.randint(
            low=lower_limit,
            high=upper_limit + 1,
            size=(rows, cols),
        )

    def find_best_strategy_point(self, potential_x_set: Set,
                                 line_functions: List[Callable]) -> List:
        values = []
        function_for_iteration = min if self.is_2xn_matrix_game else max
        function_for_best_strategy = max if self.is_2xn_matrix_game else min

        for x in potential_x_set:
            values.append(
                function_for_iteration([[x, line_fn(x)] for line_fn in line_functions],
                                       key=lambda i: i[1])
            )

        return function_for_best_strategy(values, key=lambda i: i[1])

    @classmethod
    def find_line_intersections(cls, lines: List[LineString]) -> Set:
        intersection_points_x_coordinates = {0, 1}
        for i in range(len(lines)):
            for j in range(i + 1, len(lines)):
                intersection = lines[i].intersection(lines[j])
                if not intersection.is_empty:
                    intersection_points_x_coordinates.add(intersection.x)
        return intersection_points_x_coordinates

    def build_lines_for_plot(self) -> Tuple[List[LineString], List[Callable]]:
        lines = []
        line_functions = []
        if self.is_2xn_matrix_game:
            matrix = self.game_model.transpose()
        else:
            matrix = self.game_model

        for row in matrix:
            y1, y2 = row
            lines.append(
                LineString(
                    coordinates=[[0, y1], [1, y2]]
                )
            )
            line_functions.append(
                lambda x, y_values=row:
                y_values[1] * x + y_values[0] * (1 - x)
            )
        return lines, line_functions

    def run(self, m: int = 4, n: int = 5, c1: int = -10, c2: int = 25, is_2xn_matrix_game: bool = False) -> None:
        if self.game_model is None:
            if is_2xn_matrix_game:
                print(f'Генерація матриці розміром 2x{n}...')
                self.generate_matrix(2, n, -c1, c2)
            else:
                print(f'Генерація матриці розміром {m}x2...')
                self.generate_matrix(m, 2, -c1, c2)

        self.is_2xn_matrix_game = self.game_model.shape[0] == 2

        for row in self.game_model:
            print(row)

        lines, functions = self.build_lines_for_plot()
        y_interval_values = [
            (line_fn(0), line_fn(1))
            for line_fn in functions
        ]

        x_intersection_values = self.find_line_intersections(lines)

        best_strategy_x, best_strategy_y = (
            self.find_best_strategy_point(x_intersection_values, functions)
        )
        p_strategy = 1 - best_strategy_x, best_strategy_x

        print(f'Оптимальна стратегія:')
        print(f'{"X" if self.is_2xn_matrix_game else "Y"} = {p_strategy}')
        print(f'Ціна гри: {best_strategy_y}')

        Plotter.plot(
            is_2xn_matrix_game=self.is_2xn_matrix_game,
            best_strategy=(best_strategy_x, best_strategy_y),
            lines_y_coordinates=y_interval_values,
        )


if __name__ == '__main__':
    GraphAnalyticalMethodRunner().run()
    print(' ')
    print('=' * 50)
    print(' ')

    # матриця 2xN, сідлова точка 13 - [0, 2]
    GraphAnalyticalMethodRunner(game_model=np.array([
        [-10, 5, 13, -7],
        [-1, 10, -9, 25],
    ])
    ).run()
    print(' ')
    print('=' * 50)
    print(' ')

    # матриця 2xN, немає сідлової точки
    GraphAnalyticalMethodRunner(
        game_model=np.array([
            [11, 2, 14, 10],
            [10, 9, 13, -7],
        ])
    ).run()
    print(' ')
    print('=' * 50)
    print(' ')

    # матриця Mx2, сідлова точка 19 - [1, 0]
    GraphAnalyticalMethodRunner(
        game_model=np.array([
            [-8, 5],
            [19, -9],
            [-4, 10],
            [0, -3],
            [-4, 8]
        ])
    ).run()
    print(' ')
    print('=' * 50)
    print(' ')

    # матриця Mx2, немає сідлової точки
    GraphAnalyticalMethodRunner(
        game_model=np.array([
            [-10, -3],
            [-5, -1],
            [-4, -6],
            [-1, -4],
            [-7, -5]
        ])
    ).run()
