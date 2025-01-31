# 🚆 Railway Ticket Reservation API

## **📌 Overview**
This project is a **Railway Ticket Reservation API**, designed to manage railway ticket bookings with confirmed, RAC (Reservation Against Cancellation), and waiting-list logic.

## **📢 Features**
- 🎟 **Book a Ticket** (Priority for senior citizens & women with children)
- ❌ **Cancel a Ticket** (Automatically promotes RAC → Confirmed, Waiting → RAC)
- 📋 **View Booked Tickets** (See passenger details & booking status)
- 📊 **View Available Tickets** (Check available confirmed, RAC, and waiting list seats)
- ✅ **Concurrency Handling** (Prevents double booking)
- 🐳 **Dockerized Deployment** (Runs via Docker for easy setup)

---

## **📜 API Endpoints**

| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/api/v1/tickets/book` | Book a new ticket |
| **POST** | `/api/v1/tickets/cancel/{ticketId}` | Cancel a ticket by ID |
| **GET** | `/api/v1/tickets/booked` | Get list of booked tickets |
| **GET** | `/api/v1/tickets/available` | Get available seats count |

### **🔎 API Testing with Postman**

#### **1️⃣ Booking a Ticket**
- Open **Postman** and create a **POST request** to `http://localhost:5000/api/v1/tickets/book`
- Go to the **Body** tab, select **raw**, and set format to **JSON**
- Input the following JSON payload:
  ```json
  {
    "name": "John Doe",
    "age": 65,
    "gender": "Male",
    "hasChild": false,
    "ticekt_id": 100
  }
  ```
- Click **Send**
- Expected Response:
  ```json
  {
    "message": "Ticket booked successfully",
    "passengerId": 1,
    "status": "CONFIRMED"
  }
  ```

#### **2️⃣ Cancel a Ticket**
- Send a **POST request** to `http://localhost:5000/api/v1/tickets/cancel/1`
- Expected Response:
  ```json
  {
    "message": "Ticket canceled successfully"
  }
  ```

#### **3️⃣ Get Available Tickets**
- Send a **GET request** to `http://localhost:5000/api/v1/tickets/available`
- Expected Response:
  ```json
  {
    "confirmedAvailable": 60,
    "racAvailable": 5,
    "waitingAvailable": 2
  }
  ```

---

## **🗃 Database Schema**

```
CREATE TABLE passengers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
    hasChild BOOLEAN DEFAULT FALSE
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    passenger_id INT NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('CONFIRMED', 'RAC', 'WAITING')) NOT NULL,
    berth_type TEXT CHECK (berth_type IN ('LOWER', 'MIDDLE', 'UPPER', 'SIDE-LOWER')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE berth_allocations (
    id SERIAL PRIMARY KEY,
    type TEXT CHECK (type IN ('CONFIRMED', 'RAC', 'WAITING')) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL
);
```

---

## **📊 Flowchart: Seat Allocation Logic**

```mermaid
graph TD;
  A[User Requests Ticket] -->|Check Available Confirmed Seats| B{Confirmed Available?};
  B -- Yes --> C[Assign Confirmed Berth];
  B -- No --> D{RAC Available?};
  D -- Yes --> E[Assign RAC Berth];
  D -- No --> F{Waiting List Available?};
  F -- Yes --> G[Assign Waiting List Spot];
  F -- No --> H[Return "No Tickets Available"];
```

---

## **🛠️ Setup & Deployment**

### **1️⃣ Clone Repository**
```sh
git clone https://github.com/yourusername/railway-reservation.git
cd railway-reservation
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Run Locally (Without Docker)**
```sh
npm start
```

### **4️⃣ Run Using Docker**
```sh
docker-compose up --build
```

### **5️⃣ Stop Docker Containers**
```sh
docker-compose down
```

---

## **✅ Contributing**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-xyz`)
3. Commit changes (`git commit -m 'Added new feature'`)
4. Push to branch (`git push origin feature-xyz`)
5. Create a Pull Request

---

## **📜 License**
This project is licensed under the MIT License.

---

## **📧 Contact**
For questions, reach out at **mahibhatt2001@gmail.com**

