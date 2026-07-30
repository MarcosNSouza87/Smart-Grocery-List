import { View, Text } from "react-native";
import { ShoppingCart } from "phosphor-react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white gap-2">
      <ShoppingCart size={48} color="#FFD60A" weight="bold" />
      <Text className="text-2xl font-bold text-yellow-500">
        Smart Grocery List
      </Text>
      <Text className="text-base text-gray-600">
        NativeWind is working!
      </Text>
    </View>
  );
}