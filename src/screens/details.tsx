import { HStack, useToast, VStack } from "native-base";
import { Share } from "react-native";
import { Header } from "../components/Header";
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { Guesses } from "../components/Guesses";
import { api } from "../services/api";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Loading } from "../components/Loading";

export function Details() {
const[optionSelected, setOptionSelected] = useState<'Seu Palpites'| 'Ranking do grupo'>('Seu Palpites')
    const [isLoading, setIsLoading] = useState(true);
    const [poolsDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);

    interface RouteParams {
        id: string;
    }

    const route = useRoute();
    const toast = useToast();
    const { id } = route.params as RouteParams;

    async function fetchPoolDetails() {
        try {
            setIsLoading(true)

            const response = await api.get(`/pools/${id}`)
            setPoolDetails(response.data.pool,)
            // console.log(response.data.pool)
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possivel carregar bolões',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

async function handleCodeShare() {
    await Share.share({
        message:poolsDetails.code
    }      
    )
    
}

    useEffect(() => {
        fetchPoolDetails()
    }, [id]);

    if (isLoading) {
        return (<Loading />)
    }


    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={poolsDetails.title}
                showBackButton
                showShareButton
                onShare={handleCodeShare}
            />
            {
                poolsDetails._count?.participants > 0 ?
                    <VStack px={5} flex={1}>
                        <PoolHeader data={poolsDetails} />
                        <HStack bgColor="gray.800" p={1} rounded={"sm"} mb={5}>
                            <Option 
                            title="Seus Palpites" 
                            isSelected={optionSelected==='Seu Palpites'} 
                            onPress={()=>setOptionSelected('Seu Palpites')}
                            />
                            <Option 
                            title="Ranking do grupo" 
                            isSelected={optionSelected==='Ranking do grupo'} 
                            onPress={()=>setOptionSelected('Ranking do grupo')}
                            />
                        </HStack>
                        <Guesses poolId={poolsDetails.id} code={poolsDetails.code}/>
                    </VStack>
                    : <EmptyMyPoolList code={poolsDetails.code} />
            }
        </VStack>
    )
}