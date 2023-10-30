import pulp
from pulp import PULP_CBC_CMD




def make_matrix_positive(matrix):
   transformator = abs(min(min(row) for row in matrix)) + 1
   return [[item + transformator for item in row] for row in matrix], transformator

def transpose_matrix(matrix):
   return [[row[i] for row in matrix] for i in range(len(matrix[0]))]



def first_player_problem(matrix):
   pos_matrix, transformator = make_matrix_positive(matrix)
   pos_matrix = transpose_matrix(pos_matrix)
   problem = pulp.LpProblem('P1', pulp.LpMinimize)
   variables = [pulp.LpVariable(f'x{i}', lowBound=0) for i in range(1, len(pos_matrix[0]) + 1)]
   for row in pos_matrix:
       problem += sum(row[i] * variables[i] for i in range(len(pos_matrix[0]))) >= 1


   problem += pulp.lpSum(variables)
   problem.solve(PULP_CBC_CMD(msg=0))
   if pulp.LpStatus[problem.status] == 'Optimal':
       values = [round(var.varValue, 4) for var in variables]
       print('x =', values)
       game_price_pos = 1 / sum(values)
       p = [value * game_price_pos for value in values]
       return p, game_price_pos - transformator
   else:
       raise RuntimeError("No solution found.")



def second_player_problem(matrix):
   pos_matrix, transformator = make_matrix_positive(matrix)
   problem = pulp.LpProblem('P1', pulp.LpMaximize)
   variables = [pulp.LpVariable(f'x{i}', lowBound=0) for i in range(1, len(pos_matrix[0]) + 1)]
   for row in pos_matrix:
       problem += sum(row[i] * variables[i] for i in range(len(pos_matrix[0]))) <= 1


   problem += pulp.lpSum(variables)
   problem.solve(PULP_CBC_CMD(msg=0))
   if pulp.LpStatus[problem.status] == 'Optimal':
       values = [round(var.varValue, 4) for var in variables]
       print('y =', values)
       game_price_pos = 1 / sum(values)
       q = [value * game_price_pos for value in values]
       return q, game_price_pos - transformator
   else:
       raise RuntimeError("No solution found.")




if __name__ == "__main__":
   matrix = [
       [5, 4, -1, 4, 3],
       [1, 2, 0, -2, -1],
       [-4, 5, -3, 2, -2],
       [-3, 1, -2, 3, 1],
   ]
   pos_matrix, transformator = make_matrix_positive(matrix)
   print("Нормалізована матриця:")
   for row in pos_matrix:
       print(row)

   print(' ')
   
   first_player_solution, V1 = first_player_problem(matrix)
   print("p =", first_player_solution)
   print('V =', V1)

   print(' ')

   second_player_solution, V2 = second_player_problem(matrix)
   print("q =", second_player_solution)
   print('V =', V2)