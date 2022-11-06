import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { useState } from "react";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";


export function Find() {
    const [isLoading, setIsLoading] = useState(false);

    const [code, setCode] = useState('');

    const { navigate } = useNavigation();

    const toast = useToast();

    async function handleJoinPool() {
        try {
            setIsLoading(true)
            if (!code.trim()) {
                return toast.show({
                    title: 'Informe o codigo do bolões',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
            // const response = 
            await api.post('/pools/join', { code });
            // setCode(response.data.pools);
            
            navigate('pools');
            toast.show({
                title: 'Encontrado o bolões',
                placement: 'top',
                bgColor: 'green.500'
            })
            setIsLoading(false)
            
        } catch (error) {
            console.log(error)

            if (error.response?.data?.message.trim() === 'Pool not found.') {
                toast.show({
                    title: 'Não foi possivel Encoontrar o bolões',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            if (error.response?.data?.message.trim() === 'You have already joined this pool.') {
                toast.show({
                    title: 'Usuario ja esta nesse bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            toast.show({
                title: 'Não foi possivel Encoontrar o bolões generic',
                placement: 'top',
                bgColor: 'red.500'
            })

        }finally {
            setIsLoading(false);
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar Por Código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily={"heading"} color="white" fontSize={"xl"} mb={"8"} textAlign="center" >
                    Encontre um bolão através {'\n'}de seu código único
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                />



                <Button title="BUSCAR BOLÃO"
                    isLoading={isLoading}
                    onPress={handleJoinPool}
                    
                />


            </VStack>
        </VStack>

    );
}