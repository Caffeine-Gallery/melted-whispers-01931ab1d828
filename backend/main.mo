import Bool "mo:base/Bool";
import Char "mo:base/Char";

import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";

actor {
    // Types
    type Reservation = {
        name: Text;
        email: Text;
        guests: Nat;
        date: Time.Time;
        code: Text;
    };

    // Constants
    let MAX_DAILY_RESERVATIONS = 20;
    let RESTAURANT_END_DATE = 1703980800000000000; // Dec 31, 2023
    
    // State
    stable var reservations : [Reservation] = [];
    private let reservationBuffer = Buffer.Buffer<Reservation>(0);

    // Initialize buffer with stable data
    private func loadStableData() {
        for (reservation in reservations.vals()) {
            reservationBuffer.add(reservation);
        };
    };
    loadStableData();

    // System functions for upgrades
    system func preupgrade() {
        reservations := Buffer.toArray(reservationBuffer);
    };

    system func postupgrade() {
        loadStableData();
    };

    // Menu items
    public query func getMenu() : async [(Text, Text, Nat)] {
        [
            ("Classic Raclette", "Traditional raclette with potatoes, pickled onions, and charcuterie", 25),
            ("Truffle Raclette", "Luxury raclette with black truffle and premium cheese selection", 35),
            ("Classic Fondue", "Traditional Swiss cheese fondue with bread and potatoes", 30),
            ("Champagne Fondue", "Deluxe fondue made with champagne and premium cheese blend", 40)
        ]
    };

    // Check if restaurant is still operating
    public query func isOperating() : async Bool {
        Time.now() < RESTAURANT_END_DATE
    };

    // Get remaining days
    public query func getRemainingDays() : async Int {
        let remaining = (RESTAURANT_END_DATE - Time.now()) / 86400000000000;
        remaining
    };

    // Make reservation
    public func makeReservation(name: Text, email: Text, guests: Nat, date: Time.Time) : async ?Text {
        if (Time.now() >= RESTAURANT_END_DATE) {
            return null;
        };

        let dailyReservations = Array.filter<Reservation>(
            Buffer.toArray(reservationBuffer),
            func(r: Reservation) : Bool {
                let reservationDay = r.date / 86400000000000;
                let requestedDay = date / 86400000000000;
                reservationDay == requestedDay
            }
        );

        if (dailyReservations.size() >= MAX_DAILY_RESERVATIONS) {
            return null;
        };

        let code = generateCode(name, date);
        let reservation : Reservation = {
            name = name;
            email = email;
            guests = guests;
            date = date;
            code = code;
        };

        reservationBuffer.add(reservation);
        ?code
    };

    // Generate unique reservation code
    private func generateCode(name: Text, date: Time.Time) : Text {
        let nameChars = Text.toArray(name);
        let prefix = Text.fromIter(
            Array.tabulate<Char>(
                if (nameChars.size() < 3) { nameChars.size() } else { 3 },
                func(i: Nat) : Char { nameChars[i] }
            ).vals()
        );
        let timestamp = Int.toText(date);
        let suffixChars = Text.toArray(timestamp);
        let suffix = Text.fromIter(
            Array.tabulate<Char>(
                if (suffixChars.size() < 6) { suffixChars.size() } else { 6 },
                func(i: Nat) : Char { suffixChars[i] }
            ).vals()
        );
        prefix # "-" # suffix
    };

    // Get secret location (only with valid reservation code)
    public query func getLocation(code: Text) : async ?Text {
        let reservation = Array.find<Reservation>(
            Buffer.toArray(reservationBuffer),
            func(r: Reservation) : Bool { r.code == code }
        );

        switch (reservation) {
            case (null) { null };
            case (?r) {
                ?"Grand Place 15, 1000 Brussels - Look for the golden door with a cheese symbol"
            };
        }
    };
}
