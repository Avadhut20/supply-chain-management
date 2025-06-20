// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedicineTransactionManager {
    enum OrderStatus {
        Ordered,
        DealerPurchased,
        ShippedByManufacturer,
        DeliveredToDealer,
        DeliveredToPatient,
        Completed
    }

    struct MedicineOrder {
        uint id;
        address patient;
        address manufacturer;
        address hospital;
        address dealer;
        uint price;
        uint hospitalShare;
        uint dealerShare;
        OrderStatus status;
    }

    uint public orderCounter;
    mapping(uint => MedicineOrder) public orders;

    event OrderCreated(
        uint indexed orderId,
        address indexed manufacturer,
        address indexed hospital,
        address dealer
    );

    event MedicineOrdered(
        uint indexed orderId,
        address patient,
        address manufacturer,
        address hospital,
        address dealer,
        uint price
    );

    event DealerConfirmed(uint indexed onChainOrderId);
    event ManufacturerShipped(uint indexed orderId);
    event DealerDelivered(uint indexed orderId);
    event PatientReceived(uint indexed orderId);
    event PaymentReleased(
        uint indexed orderId,
        address hospital,
        uint hospitalShare,
        address dealer,
        uint dealerShare
    );

    function createOrder(
        address manufacturer,
        address hospital,
        address dealer,
        uint hospitalShare,
        uint dealerShare
    ) public payable returns (uint) {
        require(manufacturer != address(0), "Manufacturer address cannot be zero");
        require(hospital != address(0), "Hospital address cannot be zero");
        require(dealer != address(0), "Dealer address cannot be zero");

        uint price = hospitalShare + dealerShare;
        require(msg.value == price, "Incorrect ETH sent");

        orders[orderCounter] = MedicineOrder({
            id: orderCounter,
            patient: msg.sender,
            manufacturer: manufacturer,
            hospital: hospital,
            dealer: dealer,
            price: price,
            hospitalShare: hospitalShare,
            dealerShare: dealerShare,
            status: OrderStatus.Ordered
        });

        emit OrderCreated(orderCounter, manufacturer, hospital, dealer);

        emit MedicineOrdered(orderCounter, msg.sender, manufacturer, hospital, dealer, price);

        orderCounter++;
        return orderCounter - 1;
    }

    function dealerConfirmed(uint orderId) public {
        require(orderId < orderCounter, "Order ID does not exist");
        require(orders[orderId].status == OrderStatus.Ordered, "Order is not in 'Ordered' state");
        require(msg.sender == orders[orderId].dealer, "Caller is not the assigned dealer");
        orders[orderId].status = OrderStatus.DealerPurchased;
        emit DealerConfirmed(orderId);
    }

    function manufacturerShipped(uint orderId) public {
        require(orders[orderId].status == OrderStatus.DealerPurchased, "Invalid state");
        orders[orderId].status = OrderStatus.ShippedByManufacturer;
        emit ManufacturerShipped(orderId);
    }

    function dealerDelivered(uint orderId) public {
        require(orders[orderId].status == OrderStatus.ShippedByManufacturer, "Invalid state");
        orders[orderId].status = OrderStatus.DeliveredToDealer;
        emit DealerDelivered(orderId);
    }

    function patientReceived(uint orderId) public {
        MedicineOrder storage order = orders[orderId];
        require(msg.sender == order.patient, "Not your order");
        require(order.status == OrderStatus.DeliveredToDealer, "Not yet deliverable");

        order.status = OrderStatus.Completed;

        payable(order.hospital).transfer(order.hospitalShare);
        payable(order.dealer).transfer(order.dealerShare);

        emit PatientReceived(orderId);
        emit PaymentReleased(orderId, order.hospital, order.hospitalShare, order.dealer, order.dealerShare);
    }

    function getOrderStatus(uint orderId) public view returns (OrderStatus) {
        return orders[orderId].status;
    }
}
