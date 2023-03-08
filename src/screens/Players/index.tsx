import { useState } from 'react';
import { FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { Button } from '@components/Button';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { ListEmpty } from '@components/ListEmpty';
import { ButtonIcon } from '@components/ButtonIcon';
import { PlayerCard } from '@components/PlayerCard';

type RouteParams = {
    group: string;
}

export function Players(){
    const [team, setTeam] = useState('time a');
    const [players, setPlayers] = useState([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    return(
        <Container>
            <Header showBackButton/>

            <Highlight
                title={group}
                subtitle='adicione a galera e separe os times'
            />

            <Form>
                <Input
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                />

                <ButtonIcon 
                    icon='add'
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

            <FlatList
                data={players}
                keyExtractor={item => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <PlayerCard 
                        name={item}
                        onRemove={() => {}}
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

            <Button
                title='Remover Turma'
                type='SECONDARY'
            />
        </Container>
    );
}