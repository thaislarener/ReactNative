import { Alert } from 'react-native';
import { useState } from 'react';
import { AppError } from '@utils/AppError';
import { groupCreate } from '@storage/group/groupCreate';
import { useNavigation } from '@react-navigation/native';
import { Container, Content, Icon } from './styles';

import { Input } from '@components/Input';
import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { Highlight } from '@components/Highlight';

export function NewGroup(){
    const [group, setGroup] = useState('');
    const navigation = useNavigation();

    async function handleNew(){ 
        try{
            //Verifica se nome do grupo está vazio
            if(group.trim().length === 0){
                return Alert.alert('Novo Grupo', 'Informe o nome da turma.');
            }

            await groupCreate(group);
            navigation.navigate('players', {group});
        }
        catch(error){
            if(error instanceof AppError){
                Alert.alert('Novo Grupo', error.message);
            }
            else{
                Alert.alert('Novo Grupo', 'Não foi possível criar um novo grupo.');
                console.log(error);
            }

            console.log(error);
        }
    }
    return(
        <Container>
            <Header showBackButton/>

            <Content>
                <Icon />
                <Highlight 
                    title='Nova turma'
                    subtitle='crie a turma para adicionar as pessoas'
                />

                <Input
                    placeholder='Nome da turma'
                    onChangeText={setGroup}
                />
                <Button
                    title='Criar'
                    style={{marginTop: 20}}
                    onPress={handleNew}
                />
            </Content>
        </Container>
    );
};