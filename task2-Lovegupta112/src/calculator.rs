///-------------------------------------------------------------------------------
///
/// This is your calculator implementation task 
/// to practice enums, structs, and methods.
/// 
/// Complete the implementation of the Calculator struct and its methods.
/// 
/// The calculator should support basic arithmetic 
/// operations (addition, subtraction, multiplication)
/// with overflow protection and maintain a history 
/// of operations.
/// 
/// Tasks:
/// 1. Implement the OperationType enum methods
/// 2. Implement the Operation struct constructor
/// 3. Implement all Calculator methods
/// 
///-------------------------------------------------------------------------------

#[derive(Clone)]
pub enum OperationType {
    Addition,
    Subtraction,
    Multiplication
}

impl OperationType {
    // TODO: Return the string representation of the operation sign
    // Addition -> "+", Subtraction -> "-", Multiplication -> "*"
    pub fn get_sign(&self) -> &str {
        // todo!()
        match self{
           Self::Addition=>"+",
           Self::Subtraction =>"-",
           Self::Multiplication=>"*"
        }
    }
    
    // TODO: Perform the operation on two i64 numbers with overflow protection
    // Return Some(result) on success, None on overflow
    //
    // Example: OperationType::Multiplication.perform(x, y)
    pub fn perform(&self, x: i64, y: i64) -> Option<i64> {
        // todo!()
        match self{
            Self::Addition => x.checked_add(y),
            Self::Subtraction => x.checked_sub(y),
            Self::Multiplication=> x.checked_mul(y)
        }
    }
}

#[derive(Clone)]
pub struct Operation {
    pub first_num: i64,
    pub second_num: i64,
    pub operation_type: OperationType
}

impl Operation {
    // TODO: Create a new Operation with the given parameters
    pub fn new(first_num: i64, second_num: i64, operation_type: OperationType) -> Self {
        // todo!()
        Operation { first_num, second_num, operation_type }
    }
}

pub struct Calculator {
    pub history: Vec<Operation>
}

impl Calculator {
    // TODO: Create a new Calculator with empty history
    pub fn new() -> Self {
        // todo!()
        Calculator { history: Vec::new() }
    }
    
    // TODO: Perform addition and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn addition(&mut self, x: i64, y: i64) -> Option<i64> {
        // todo!()
       let addition_res= OperationType::Addition.perform(x, y);

          if let Some(data)= addition_res {
               self.history.push(Operation::new( x, y,  OperationType::Addition  ));
                Some(data)
            }
            else {
                None
            }
        
    }
    
    // TODO: Perform subtraction and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn subtraction(&mut self, x: i64, y: i64) -> Option<i64> {
        // todo!()
         let subtraction_res= OperationType::Subtraction.perform(x, y);

          if let Some(data)= subtraction_res {
               self.history.push(Operation::new( x,  y,  OperationType::Subtraction ));
               Some(data)
            }
            else{
                None 
            }
        
    }
    
    // TODO: Perform multiplication and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn multiplication(&mut self, x: i64, y: i64) -> Option<i64> {
        // todo!()
       let multiplication_res= OperationType::Multiplication.perform(x, y);

          if let  Some(data)= multiplication_res{
               self.history.push(Operation::new (x,  y, OperationType::Multiplication  ));
               Some(data)
            }
            else{
                None
            }
        
    }
    
    // TODO: Generate a formatted string showing all operations in history
    // Format: "index: first_num operation_sign second_num = result\n"
    //
    // Example: "0: 5 + 3 = 8\n1: 10 - 2 = 8\n"
    pub fn show_history(&self) -> String{
        // todo!()
        let mut history_data= String::from("");
       for (i,val) in  self.history.iter().enumerate(){
           let str=format!("{}: {} {} {} = {}\n",i,val.first_num,val.operation_type.get_sign(),val.second_num,val.operation_type.perform(val.first_num, val.second_num).unwrap());
           history_data.push_str(&str);
       }
       return history_data;
    }
    
    // TODO: Repeat an operation from history by index
    // Add the repeated operation to history and return the result
    // Return None if the index is invalid
    pub fn repeat(&mut self, operation_index: usize) -> Option<i64>{
        // todo!()

            let value=self.history.get(operation_index);
                
                if let Some(data) = value {
                    let res=data.operation_type.perform(data.first_num, data.second_num);
                    self.history.push(Operation::new( data.first_num,  data.second_num, data.operation_type.clone()));
                    return res;
                }
                else{
                    None 
                }
            
           
    }
    
    // TODO: Clear all operations from history
    pub fn clear_history(&mut self) {
        // todo!()
        self.history.clear();
    }
}


