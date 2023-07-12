import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { OrderUrl } from "../config/Api";
import PhoneNumber from "../modules/PhoneNumber";
import { useRoute } from "@react-navigation/native";
import OrderLinks from "../modules/OrderLinks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderListStyle from "../styles/OrderListStyle";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderCommentModal from "./OrderCommentModal";
import OrderActionModal from "./OrderActionModal";
import Icon from "react-native-vector-icons/Ionicons";

const OrderList = ({ initialParams }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const route = useRoute();
  var status = "ASSIGNED";

  if (
    route &&
    route.constructor === Object &&
    "params" in route &&
    route.params &&
    "status" in route.params
  ) {
    status = route.params.status;
  }

  useEffect(() => {
    fetchOrders(status);
  }, [route.params?.status, initialParams]);

  const fetchOrders = async (orderStatus) => {
    const userId = await AsyncStorage.getItem("@user_id");
    if (userId) {
      setLoading(true);
      try {
        const response = await fetch(
          OrderUrl + "&status=" + orderStatus + "&user_id=" + userId
        );
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      navigation.navigate("Login");
    }
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity style={styles.orderContainer}>
      <View style={{ flex: 1.5 }}>
        <Text style={styles.orderId}>ID: {item.order_id}</Text>
        <Text style={styles.orderDate}>{item.total_price}</Text>
      </View>

      <View style={styles.OrderLinks}>
        <Icon
          name="eye"
          size={25}
          color="black"
          style={styles.icons}
          onPress={() => handleOrderDetailPress(item)}
        />
        <Icon
          name="chatbubble-ellipses-outline"
          size={25}
          color="black"
          style={styles.icons}
          onPress={() => handleOrderCommentPress(item)}
        />
        <PhoneNumber phoneNumber={item.shipping_address.mobile_no} />
        <Icon
          name="ellipsis-vertical"
          size={25}
          color="black"
          style={styles.icons}
          onPress={() => handleOrderActionPress(item)}
        />
      </View>

      {/* Other order fields */}
    </TouchableOpacity>
  );

  const handleOrderDetailPress = (order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const handleOrderCommentPress = (order) => {
    setSelectedOrder(order);
    setCommentModalVisible(true);
  };

  const handleOrderActionPress = (order) => {
    setSelectedOrder(order);
    setActionModalVisible(true);
  };

  const closeModal = () => {
    setDetailsModalVisible(false);
    setCommentModalVisible(false);
    setActionModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <OrderLinks />
      </View>
      <Text style={styles.orderText}>Order Status: {status}</Text>
      <Text style={styles.orderText}>Total Orders: {orders.length}</Text>

      <ScrollView style={{ flex: 5, paddingBottom: 65 }}>
        {orders.length === 0 ? (
          <Text style={styles.noItemsText}>No Order</Text>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.order_id.toString()}
          />
        )}
      </ScrollView>

      <OrderDetailsModal
        visible={detailsModalVisible}
        order={selectedOrder}
        onClose={closeModal}
      />

      <OrderCommentModal
        visible={commentModalVisible}
        order={selectedOrder}
        onClose={closeModal}
      />

      <OrderActionModal
        visible={actionModalVisible}
        order={selectedOrder}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create(OrderListStyle);

export default OrderList;
