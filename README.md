The competition asked us to predict a series soccer matches of group round playoff games and knockout round playoff games given one regular season worth of data. Multiple data modeling ideas were generated in the process to choose which will best preform in creating accurate predictions. Creating an ELO probability model was the final decision because it allowed us to measure each team’s strength and how they would go against other team’s strengths. After researching on how an ELO probability model works, we utilized Visual Code Studio and JavaScript to create a prediction code. We set a standard 1000 ELO score to each team before the regular season commenced then ran the season changing the ELO scores each team appropriately with a given formula. Utilizing the set of ELO scores of all the teams retrieved after the regular season, we ran a simulation of the group-round games with the team’s ELO scores assisting us in creating win probabilities which we used to choose who was most likely to win while changing each team’s ELO scores each game respectively. To factor in home advantage in the regular season and group-round simulation we added a constant of 45 to each home team’s ELO score for that match but not to their actual ELO score so that this factor will only affect the probability of a team winning. For the knockout rounds we first removed the constant of 45 that boosts the home team’s ELO because games are played at a neutral site. Then we took the ELO scores for each team at the end of the regular season because the regular season predicts gameplay in the knockout-round. We then ran special cases in our code for each knockout-round scenario, and we accurately change the ELO scores based on who wins and we generate a probability number comparing the two teams ELO’s into a given formula. We made sure to pay attention to how the special case will occur making sure one event has to happen so that we get the right data to compare for the subsequent event.