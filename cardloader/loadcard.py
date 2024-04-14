import tkinter as tk
from tkinter import ttk
import json, boto3
from decimal import Decimal


class CreditCardApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Credit Card Information")
        self.current_category_row = 1
        self.current_merchant_row = 1
        self.categories = []
        self.special_merchants = []
        
        # Frames for categories and special merchants
        self.category_frame = ttk.Frame(root)
        self.category_frame.grid(row=4, column=0, sticky="w", columnspan=2, padx=5, pady=5)
        
        self.merchant_frame = ttk.Frame(root)
        self.merchant_frame.grid(row=7, column=0, sticky="w", columnspan=2, padx=5, pady=5)
        
        # Labels and entry widgets for card information
        tk.Label(root, text="Name of the Credit Card:").grid(row=0, column=0, sticky="w")
        self.card_name_entry = tk.Entry(root)
        self.card_name_entry.grid(row=0, column=1, padx=5, pady=5)
        
        tk.Label(root, text="Company offering the card:").grid(row=1, column=0, sticky="w")
        self.card_company_entry = tk.Entry(root)
        self.card_company_entry.grid(row=1, column=1, padx=5, pady=5)

        tk.Label(root, text="Base Cashback Rate:").grid(row=2, column=0, sticky="w")
        self.base_cashback_entry = tk.Entry(root)
        self.base_cashback_entry.grid(row=2, column=1, padx=5, pady=5)
        self.base_cashback_entry.config(validate="key", validatecommand=(self.root.register(self.validate_float), "%P"))

        tk.Label(root, text="Image URL").grid(row=3, column=0, sticky="w")
        self.image_url = tk.Entry(root)
        self.image_url.grid(row=3, column=1, padx=5, pady=5)
        
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
        
        # Create submit button
        self.submit_button = tk.Button(root, text="Submit", command=self.submit_data)
        self.submit_button.grid(row=8, column=0, columnspan=2, pady=10)
        
    def add_category_row(self):
        # Create a new row for a category
        self.current_category_row += 1
        category_label = ttk.Combobox(self.category_frame, state="readonly")
        category_label.grid(row=self.current_category_row, column=0, padx=5, pady=5)
        category_label['values'] = ['NO CATEGORIES','restaurant', 'drugstore', 'lodging', 'gas_station', 'grocery_or_supermarket', 'wholesale','coffee_shop', 'hotel','gym', 'transit_station']  # Placeholder values
        
        cashback_entry = tk.Entry(self.category_frame)
        cashback_entry.grid(row=self.current_category_row, column=1, padx=5, pady=5)
        cashback_entry.config(validate="key", validatecommand=(self.root.register(self.validate_float), "%P"))
        
        self.categories.append((category_label, cashback_entry))

        self.update_window_size()
        
    def add_special_row(self):
        # Create a new row for a special merchant
        self.current_merchant_row += 1
        merchant_entry = tk.Entry(self.merchant_frame)
        merchant_entry.grid(row=self.current_merchant_row, column=0, padx=5, pady=5)
        
        cashback_entry = tk.Entry(self.merchant_frame)
        cashback_entry.grid(row=self.current_merchant_row, column=1, padx=5, pady=5)
        cashback_entry.config(validate="key", validatecommand=(self.root.register(self.validate_float), "%P"))
        
        self.special_merchants.append((merchant_entry, cashback_entry))

        self.update_window_size()
        
    def validate_float(self, new_value):
        try:
            if new_value == "":
                return True
            float(new_value)
            return True
        except ValueError:
            return False
    
    def submit_data(self):
        card_name = self.card_name_entry.get()
        card_company = self.card_company_entry.get()
        cashback = self.base_cashback_entry.get()
        image_url = self.image_url.get()
        category_data = [(category[0].get(), category[1].get()) for category in self.categories]
        merchant_data = [(merchant[0].get(), merchant[1].get()) for merchant in self.special_merchants]
        try:
            if card_name == '' or card_company == '' or cashback == '':
                raise
            category = []
            for cat in category_data:
                if cat[0] == 'NO CATEGORIES':
                    continue
                if cat[0] == '':
                    continue
                if cat[1] == '':
                    raise
                category.append({cat[0]: float(cat[1])})
            specials = []
            for special in merchant_data:
                if special[0] == '':
                    continue
                if special[1] == '':
                    raise
                specials.append({special[0]: float(special[1])})
        except:
            # Display a popup on error
            popup = tk.Toplevel(self.root)
            popup.title("Error")
            popup.geometry("400x100")
            tk.Label(popup, text="There was an error parsing the data! please check for mistakes").pack(pady=20)
            tk.Button(popup, text="OK", command=popup.destroy).pack()
            return

        #create json
        credit_card_data = {
            "card_base": float(cashback),
            "card_categories": category,
            "card_company": card_company,
            "card_name": card_name,
            "card_specials": specials,
            "image_url": image_url
        }
        #dynamoDB does not support floating point numbers so convert them to Decimal
        credit_card_data['card_id'] = abs(hash(str(credit_card_data))) % (10 ** 12)
        credit_card_data = json.loads(json.dumps(credit_card_data), parse_float=Decimal)
        #upload data
        try:
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('cards')
            table.put_item(Item=credit_card_data)
        except Exception as E:
            # Display a popup for error
            popup = tk.Toplevel(self.root)
            popup.title("Error")
            popup.geometry("400x100")
            tk.Label(popup, text="There was an error uploading the data").pack(pady=20)
            tk.Label(popup, text=str(E)).pack(pady=20)
            tk.Button(popup, text="OK", command=popup.destroy).pack()
            return
    
        # Clear additional category dropdown boxes
        for category in self.categories[1:]:
            category[0].grid_forget()
            category[1].grid_forget()
        del self.categories[1:]

        # Clear the data
        self.card_name_entry.delete(0, tk.END)
        self.card_company_entry.delete(0, tk.END)
        self.base_cashback_entry.delete(0, tk.END)
        self.image_url.delete(0, tk.END)
        for category in self.categories:
            category[0].delete(0, tk.END)
            category[1].delete(0, tk.END)
        for merchant in self.special_merchants:
            merchant[0].delete(0, tk.END)
            merchant[1].delete(0, tk.END)

        # Display a popup for success
        popup = tk.Toplevel(self.root)
        popup.title("Upload Successful")
        popup.geometry("200x100")
        tk.Label(popup, text="Upload Successful!").pack(pady=20)
        tk.Button(popup, text="OK", command=popup.destroy).pack()


    def update_window_size(self):
        self.root.update_idletasks()  # Update widget sizes
        width = max(self.root.winfo_reqwidth(), 400)  # Set minimum width
        height = max(self.root.winfo_reqheight(), 300)  # Set minimum height
        self.root.geometry("{}x{}".format(width, height))

if __name__ == "__main__":
    root = tk.Tk()
    app = CreditCardApp(root)
    root.mainloop()
