export interface Transaction {
  id: string;
  description: string;
  category: "Food" | "Transport" | "Shopping" | "Bills" | "Income" | "Entertainment" | "Health" | "Other";
  amount: number;
  type: "credit" | "debit";
  date: Date;
  status: "completed" | "pending" | "failed";
  merchant?: string;
  reference?: string;
}

export interface Account {
  id: string;
  name: string;
  type: "Checking" | "Savings" | "Investment";
  balance: number;
  currency: string;
  accountNumber: string;
  isDefault: boolean;
}

export interface TransferRecipient {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  isSaved: boolean;
}

const merchants = [
  "Starbucks",
  "Amazon",
  "Uber",
  "Netflix",
  "Walmart",
  "Target",
  "Whole Foods",
  "Shell Gas Station",
  "Best Buy",
  "Spotify",
  "Google Play",
  "Apple Store",
  "DoorDash",
  "Lyft",
  "Airbnb",
  "Hotel.com",
  "Southwest Airlines",
  "Delta Airlines",
  "Chipotle",
  "McDonald's",
  "Nike",
  "Adidas",
  "Sephora",
  "Ulta Beauty",
  "Equinox Gym",
  "Planet Fitness",
];

const categories: Transaction["category"][] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date;
}

function getRandomAmount(): number {
  return Math.floor(Math.random() * 500) + 5;
}

export function generateTransactions(count: number = 50): Transaction[] {
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.85;
    const category = isIncome ? "Income" : getRandomItem(categories.slice(0, -1));

    transactions.push({
      id: `txn_${i + 1}`,
      description: isIncome ? "Salary Deposit" : getRandomItem(merchants),
      category,
      amount: isIncome ? Math.floor(Math.random() * 5000) + 3000 : getRandomAmount(),
      type: isIncome ? "credit" : "debit",
      date: getRandomDate(90),
      status: Math.random() > 0.95 ? (Math.random() > 0.5 ? "pending" : "failed") : "completed",
      merchant: isIncome ? undefined : getRandomItem(merchants),
      reference: `REF-${String(i + 1).padStart(6, "0")}`,
    });
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function generateAccounts(): Account[] {
  return [
    {
      id: "acc_1",
      name: "Checking Account",
      type: "Checking",
      balance: 12543.75,
      currency: "USD",
      accountNumber: "****5678",
      isDefault: true,
    },
    {
      id: "acc_2",
      name: "Savings Account",
      type: "Savings",
      balance: 45230.50,
      currency: "USD",
      accountNumber: "****9012",
      isDefault: false,
    },
    {
      id: "acc_3",
      name: "Investment Account",
      type: "Investment",
      balance: 89450.25,
      currency: "USD",
      accountNumber: "****3456",
      isDefault: false,
    },
  ];
}

export function generateRecipients(): TransferRecipient[] {
  return [
    {
      id: "rec_1",
      name: "John Doe",
      accountNumber: "****1234",
      bankName: "Chase Bank",
      isSaved: true,
    },
    {
      id: "rec_2",
      name: "Jane Smith",
      accountNumber: "****5678",
      bankName: "Bank of America",
      isSaved: true,
    },
    {
      id: "rec_3",
      name: "Mike Johnson",
      accountNumber: "****9012",
      bankName: "Wells Fargo",
      isSaved: true,
    },
  ];
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getCategoryColor(category: Transaction["category"]): string {
  const colors: Record<Transaction["category"], string> = {
    Food: "bg-orange-100 text-orange-800",
    Transport: "bg-blue-100 text-blue-800",
    Shopping: "bg-pink-100 text-pink-800",
    Bills: "bg-red-100 text-red-800",
    Income: "bg-green-100 text-green-800",
    Entertainment: "bg-purple-100 text-purple-800",
    Health: "bg-cyan-100 text-cyan-800",
    Other: "bg-gray-100 text-gray-800",
  };
  return colors[category];
}
