import React from 'react';
import {FlatList} from "react-native";

export default function useFlatList(data, renderItem) {

    const List = (<FlatList
        showVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
            paddingTop: 20,
        }}
        data={data}
        scrollEnabled={true}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
    />);

    return [List]

}