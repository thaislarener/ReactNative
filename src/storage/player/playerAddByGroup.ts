import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppError } from '@utils/AppError';
import{ PlayerStorageDTO } from './PlayerStorageDTO';
import { playersGetByGroup } from './playersGetByGroup';
import { PLAYER_COLLECTION } from '@storage/storageConfig';

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string){
    try{
        const storedPlayers = await playersGetByGroup(group);

        //Verifica se jogador já existe
        const playerAlredyExists = storedPlayers.filter(player => player.name === newPlayer.name)
        if(playerAlredyExists.length > 0)
            throw new AppError('Essa pessoa já está adicionada em um time');

        const storage = JSON.stringify([...storedPlayers, newPlayer]);

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
    }
    catch(error){
        throw (error);
    }
}