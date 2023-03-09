import { Container, Form, HeaderList, NumberOfPlayers } from './styles';
import { AppError } from '@utils/AppError';
import { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';


import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { Button } from '@components/Button';
import { Header } from '@components/Header';
import { Loading } from '@components/Loading';
import { Highlight } from '@components/Highlight';
import { ListEmpty } from '@components/ListEmpty';
import { ButtonIcon } from '@components/ButtonIcon';
import { PlayerCard } from '@components/PlayerCard';

type RouteParams = {
    group: string;
}

export function Players(){
    const [isLoading, setIsLoading] = useState(true);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('time a');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
    
    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer(){
        if(newPlayerName.trim().length === 0)
            return Alert.alert('Nova pessoa','Informe o nome da pessoa para adicionar.')
        
        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try{
            await playerAddByGroup(newPlayer, group);

            //Tira foco do input
            newPlayerNameInputRef.current?.blur();
            setNewPlayerName('');
            fetchPlayersByTeam();
        }
        catch(error){
            if(error instanceof AppError)
                Alert.alert('Nova pessoa', error.message);
            else{
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar jogador.');
            }
        }
    }

    async function fetchPlayersByTeam(){
        try{
            setIsLoading(true);

            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        }
        catch(error){
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar os jogadores.')
        }
        finally{
            setIsLoading(false);
        }
    }

    async function handlePlayerRemove(playerName: string){
        try{
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        }
        catch(error){
            console.log(error);
            Alert.alert('Remover Pessoa', 'Não foi possível remover o jogador.');
        }
    }
    
    async function groupRemove(){
        try{
            await groupRemoveByName(group);
            navigation.navigate('groups');
            
        }
        catch(error){
            console.log(error);
            Alert.alert('Remover turma', 'Não foi possível remover a turma.');
        }
    }

    async function handleGroupRemove(){
        Alert.alert(
            'Remover', 
            'Deseja remover turma?', 
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => groupRemove()}
            ]);
    }
    
    useEffect(( )=> {
        fetchPlayersByTeam();
    }, [team]);

    return(
        <Container>
            <Header showBackButton/>

            <Highlight
                title={group}
                subtitle='adicione a galera e separe os times'
            />

            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder='Nome do jogador'
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType='done'
                />

                <ButtonIcon 
                    icon='add'
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['time a', 'time b']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>
            
            {
                isLoading ? <Loading/> :
            
                <FlatList
                    data={players}
                    keyExtractor={item => item.name}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <PlayerCard 
                            name={item.name}
                            onRemove={() => handlePlayerRemove(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty 
                        message='Não há pessoas nesse time'
                        />
                    )}
                    contentContainerStyle={[
                        {paddingBottom: 100 },
                        players.length === 0 && { flex: 1}
                    ]}
                />
        }

            <Button
                title='Remover turma'
                type='SECONDARY'
                onPress={handleGroupRemove}
            />
        </Container>
    );
}
