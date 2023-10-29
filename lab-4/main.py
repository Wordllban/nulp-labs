import math
from typing import Dict, List




class CooperativeGameSolver:
   def __init__(self, characteristic_function_v: Dict[str, int]) -> None:
       self.V = characteristic_function_v
       self.normalized_V = dict()
       self.shapley_vector = dict()
       self.number_of_players = len(max(self.V, key=len))


   @property
   def all_coalitions(self) -> List[str]:
       return list(self.V.keys())


   @property
   def coalitions_of_players(self) -> List[str]:
       return [x for x in self.all_coalitions if self.number_of_players > len(x) > 1]


   @property
   def max_coalition(self) -> str:
       return next(
           filter(
               lambda x: len(x) == self.number_of_players, self.all_coalitions
           )
       )


   @property
   def players(self) -> List[str]:
       return [*self.max_coalition]


   @property
   def empty_coalition(self) -> str:
       return next(
           filter(
               lambda x: x == '', self.all_coalitions
           )
       )


   @property
   def is_super_additive(self) -> bool:
       additivity_for_coalition = list()
       for players in self.coalitions_of_players:
           additivity_for_coalition.append(
               is_super_additive :=
               self.V[players] >= self.sum_coalition(players)
           )
           if not is_super_additive:
               print(
                   'False because: '
                   f'V({players}) = {self.V[players]} < '
                   f'{" + ".join(f"V({player})" for player in players)} = '
                   f'{" + ".join(str(self.V[player]) for player in players)}'
               )
       return all(additivity_for_coalition)


   @property
   def is_essential(self) -> bool:
       """
       \n V(MAX_COALITION) < sum(V for all players)
       """
       is_essential = (
           self.V[self.max_coalition] < self.sum_coalition(self.max_coalition)
       )
       if not is_essential:
           print(
               'False because: '
               f'V({self.max_coalition}) = {self.V[self.max_coalition]} >= '
               f'{" + ".join(f"V({player})" for player in self.players)} = '
               f'{" + ".join(str(self.V[player]) for player in self.players)}'
           )
       return is_essential


   @property
   def is_core_empty(self) -> bool:
       """
       \n V'(COALITION) <= 1 / (NUM_OF_PLAYERS - NUM_IN_COALITION + 1)
       """
       is_core_per_coalition = list()


       for coalition in self.all_coalitions:
           if coalition:
               is_core_per_coalition.append(
                   is_core :=
                   self.normalized_V[coalition] <=
                   1 / (self.number_of_players - len(coalition) + 1)
               )
               print(
                   f"V'({''.join(coalition)}) = "
                   f"{self.normalized_V[coalition]:.2f} <= "
                   f"{1 / (self.number_of_players - len(coalition) + 1):.2f} "
                   f"{is_core}"
               )
       return not all(is_core_per_coalition)


   @property
   def is_shapley_vector_belongs_to_core(self) -> bool:
       """
       \n V(COALITION) <= sum(ф(V) for all players in coalition)
       """
       is_core_check_per_coalition = list()
       for coalition in self.all_coalitions:
           if coalition:
               sum_ = sum([self.shapley_vector[player] for player in coalition])
               is_core_check_per_coalition.append(
                   is_core :=
                   any(
                       [self.V[coalition] <= sum_, self.V[coalition] - sum_ < 0.1]
                   )
               )
               if not is_core:
                   print(
                       'False because: '
                       f'V({coalition}) = '
                       f'{self.V[coalition]} > '
                       f'{sum([self.shapley_vector[player] for player in coalition])} '
                   )
       return all(is_core_check_per_coalition)


   def get_normalized_form(self) -> None:
       """
       \n V(COALITION) - sum(V for players in coalition) /
       \n V(MAX_COALITION) - sum(V for all players)
       \n V'() = 0, V'(player) = 0, V'(MAX_COALITION) = 1
       """
       self.normalized_V[self.empty_coalition] = 0
       self.normalized_V[self.max_coalition] = 1
       for player in self.players:
           self.normalized_V[player] = 0


       for coalition in self.coalitions_of_players:
           self.normalized_V[coalition] = (
               (self.V[coalition] - self.sum_coalition(coalition)) /
               (self.V[self.max_coalition] - self.sum_coalition(self.max_coalition))
           )


   def get_coalitions_by_player(self, player: str) -> List[str]:
       return [x for x in self.all_coalitions if player in x]


   @classmethod
   def get_coalition_without_player(cls, coalition: str, player: str) -> str:
       return coalition.replace(player, '')


   def sum_coalition(self, coalition: str) -> int:
       return sum([self.V[player] for player in coalition])


   def calculate_shapley_value(self, player: str) -> float:
       """
       \n V(COALITION) - V(COALITION_WITHOUT_PLAYER) *
       \n (NUM_IN_COALITION - 1)! * (NUM_OF_PLAYERS - NUM_IN_COALITION)! /
       \n NUM_OF_PLAYERS!
       """
       return sum(
           (
               self.V[coalition] -
               self.V[self.get_coalition_without_player(coalition, player)]
           ) *
           (
               (
                   math.factorial(len(coalition) - 1) *
                   math.factorial(self.number_of_players - len(coalition))
               ) /
               (
                   math.factorial(self.number_of_players)
               )
           )
           for coalition in self.get_coalitions_by_player(player)
       )


   def run(self) -> None:
       print('Характеристична функція:')
       print(self.V)


       print('\nСупер-аддитивність:')
       print('Чи є супер аддитивною? ', self.is_super_additive)


       print('\nІстинність гри:')
       print('Чи є істинною гра? ', self.is_essential)


       print('\nСпрощена форма:')
       self.get_normalized_form()


       for coalition in self.all_coalitions:
           print(f"V'({coalition}) = {self.normalized_V[coalition]:.2f}")


       print('\nС-ядро:')
       print('Чи є порожнім ядро?', self.is_core_empty)


       print('\nШеплі вектор :')
       for player in self.players:
           self.shapley_vector[player] = (
               self.calculate_shapley_value(player)
           )
           print(f"ф{player}(V) = {self.shapley_vector[player]:.2f}")


       print('\nНалежність вектора Шеплі С-ядру:')
       print(
           'Чи належить вектор Шеплі С-ядру? ',
           self.is_shapley_vector_belongs_to_core
       )




if __name__ == "__main__":
   CooperativeGameSolver(
       characteristic_function_v={
           '': 0,
           '1': 80,
           '2': 130,
           '3': 180,
           '12': 240,
           '13': 280,
           '23': 350,
           '123': 480,
       },
   ).run()
   