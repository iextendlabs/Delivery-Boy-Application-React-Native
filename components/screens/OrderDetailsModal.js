import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import PhoneNumber from "../modules/PhoneNumber";
import OrderListStyle from "../styles/OrderListStyle";
import { ScrollView } from "react-native-gesture-handler";
import WhatsAppElement from "../modules/WhatsappElement";
import GoogleAddressElement from "../modules/GoogleAddressElement";

const OrderDetailsModal = ({ visible, order, onClose }) => {
  if (!visible || !order) {
    return null;
  }
  const handleModalClose = () => {
    onClose();
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ScrollView>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Text style={styles.modalTitle}>Order Details</Text> */}

            {order && (
              <View style={styles.orderDetails}>
                {/* Box for Order ID */}
                <View style={styles.detailBox}>
                  <Text style={styles.detailBoxTitle}>Order#</Text>
                  <Text style={styles.detailBoxText}>{order.id}</Text>
                </View>

                {/* Box for Total Price */}
                <View style={styles.detailBox}>
                  <Text style={styles.detailBoxTitle}>Total Price</Text>
                  <Text style={styles.detailBoxText}>
                    {order.total_amount}
                  </Text>
                </View>

                {/* Box for Payment to be Collected */}
                <View style={styles.detailBox}>
                  <Text style={styles.detailBoxTitle}>
                    Payment to be Collected
                  </Text>
                  <Text style={styles.detailBoxText}>
                    {order.total_amount}
                  </Text>
                </View>

                {/* Box for Phone */}
                <View style={styles.detailBox}>
                  <Text style={styles.detailBoxTitle}>Phone</Text>
                  <View style={styles.phoneNumberContainer}>
                    {/* <Image source={require('../path/to/phone-icon.png')} style={styles.phoneIcon} /> */}
                    <PhoneNumber
                      phoneNumber={order.number}
                      showNumber={true}
                    />
                  </View>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailBoxTitle}>Whatsapp</Text>
                  <View style={styles.phoneNumberContainer}>
                    {/* <Image source={require('../path/to/phone-icon.png')} style={styles.phoneIcon} /> */}
                    <WhatsAppElement showNumber={true}
                      phoneNumber={order.whatsapp}
                    />
                  </View>
                </View>

                {/* Box for Comment */}
                <View style={styles.commentBox}>
                  <Text style={styles.detailBoxTitle}>Comments</Text>
                    {order.comments_text.map((comment, index) => (
                      <Text key={index} style={styles.commentText}>
                        {comment}
                      </Text>
                    ))}
                    
                </View>

                {/* Box for Shipping Address */}
                <View style={styles.shippingAddressBox}>
                  <Text style={styles.detailBoxTitle}>Shipping Address</Text>
                  <View style={styles.addressLineContainer}>
                    <Text style={styles.addressLine}>{order.name}</Text>
                  </View>
                  <GoogleAddressElement address={ order.buildingName + ' ' + 
                      order.street + ',' + order.area + ' ' + order.city} />
                  
                </View>

                
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create(OrderListStyle);

export default OrderDetailsModal;
