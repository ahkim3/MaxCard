import tkinter as tk
from tkinter import ttk

class CreditCardApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Credit Card Information")
        self.current_category_row = 1
        self.current_merchant_row = 1
        
        # Frames for categories and special merchants
        self.category_frame = ttk.Frame(root)
        self.category_frame.grid(row=2, column=0, sticky="w", columnspan=2, padx=5, pady=5)
        
        self.merchant_frame = ttk.Frame(root)
        self.merchant_frame.grid(row=5, column=0, sticky="w", columnspan=2, padx=5, pady=5)
        
        # Labels and entry widgets for card information
        tk.Label(root, text="Name of the Credit Card:").grid(row=0, column=0, sticky="w")
        self.card_name_entry = tk.Entry(root)
        self.card_name_entry.grid(row=0, column=1, padx=5, pady=5)
        
        tk.Label(root, text="Company offering the card:").grid(row=1, column=0, sticky="w")
        self.card_company_entry = tk.Entry(root)
        self.card_company_entry.grid(row=1, column=1, padx=5, pady=5)
        
        # Create labels and entry widgets for categories
        tk.Label(self.category_frame, text="Categories:").grid(row=0, column=0, sticky="w")
        
        tk.Label(self.category_frame, text="Category").grid(row=1, column=0, sticky="w")
        tk.Label(self.category_frame, text="Cashback Rate").grid(row=1, column=1, sticky="w")
        self.add_category_row()  # Add initial category row
        
        # Create button to add more categories
        self.add_category_button = tk.Button(self.category_frame, text="Add Category", command=self.add_category_row)
        self.add_category_button.grid(row=1, column=2, padx=5, pady=5)
        
        # Create labels and entry widgets for special merchants
        tk.Label(self.merchant_frame, text="Special Merchants:").grid(row=0, column=0, sticky="w")
        
        tk.Label(self.merchant_frame, text="Merchant Name:").grid(row=1, column=0, sticky="w")
        tk.Label(self.merchant_frame, text="Cashback Rate").grid(row=1, column=1, sticky="w")
        
        # Add initial special merchant row
        self.add_special_row()
        
        # Create button to add more special merchants
        self.add_special_button = tk.Button(self.merchant_frame, text="Add Special Merchant", command=self.add_special_row)
        self.add_special_button.grid(row=1, column=2, padx=5, pady=5)
        
    def add_category_row(self):
        # Create a new row for a category
        self.current_category_row += 1
        category_label = ttk.Combobox(self.category_frame, state="readonly")
        category_label.grid(row=self.current_category_row, column=0, padx=5, pady=5)
        category_label['values'] = ['Placeholder1', 'Placeholder2', 'Placeholder3']  # Placeholder values
        
        cashback_entry = tk.Entry(self.category_frame)
        cashback_entry.grid(row=self.current_category_row, column=1, padx=5, pady=5)
        cashback_entry.config(validate="key", validatecommand=(self.root.register(self.validate_float), "%P"))
        
    def add_special_row(self):
        # Create a new row for a special merchant
        self.current_merchant_row += 1
        merchant_entry = tk.Entry(self.merchant_frame)
        merchant_entry.grid(row=self.current_merchant_row, column=0, padx=5, pady=5)
        
        cashback_entry = tk.Entry(self.merchant_frame)
        cashback_entry.grid(row=self.current_merchant_row, column=1, padx=5, pady=5)
        cashback_entry.config(validate="key", validatecommand=(self.root.register(self.validate_float), "%P"))
        
    def validate_float(self, new_value):
        try:
            if new_value == "":
                return True
            float(new_value)
            return True
        except ValueError:
            return False

if __name__ == "__main__":
    root = tk.Tk()
    app = CreditCardApp(root)
    root.mainloop()
