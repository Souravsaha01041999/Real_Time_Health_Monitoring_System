import { React, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import io from 'socket.io-client';
import { HOST } from './ApiDetails';

import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    color: (opacity = 1) => `rgba(255,12,0, ${opacity})`,
    strokeWidth: 6,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
};

export default function GraphScreen({ route }) {
    const [graphData, onChangeGraphData] = useState([0]);
    const [graphDataOx, onChangeGraphOxData] = useState([0]);

    const roomId = route.params.message;

    useEffect(() => {
        const socket = io(HOST);
        socket.on('connect', () => { });
        socket.on('receive', (data) => {
            if (data['roomId'] == roomId) {
                onChangeGraphData((prevData) => {
                    if (prevData.length > 20) {
                        prevData.shift();
                    }
                    return [...prevData, data['hurtRate']];
                });

                onChangeGraphOxData((prvData) => {
                    if (prvData.length > 20) {
                        prvData.shift();
                    }
                    return [...prvData, data['oxLvl']];
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.textMarginTop}>{roomId}</Text>
            <LineChart
                data={{
                    datasets: [
                        {
                            data: graphData
                        }
                    ]
                }}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
            />
            <Text>Heart Rate</Text>
            <LineChart
                data={{
                    datasets: [
                        {
                            data: graphDataOx
                        }
                    ]
                }}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                style={styles.textMarginTop}
            />
            <Text>Oxygen Level</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    textMarginTop: {
        marginTop: 20
    }
});
