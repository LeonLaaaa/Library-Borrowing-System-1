const LibraryAPI = (function(){
  const DB_NAME = 'lib_api_v3';
  const DB_VER = 1;
  let db = null;

  function openDB(){
    return new Promise((res,rej)=>{
      let r = indexedDB.open(DB_NAME,DB_VER);
      r.onupgradeneeded=e=>{
        db=e.target.result;
        if(!db.objectStoreNames.contains('users')) db.createObjectStore('users',{keyPath:'username'});
        if(!db.objectStoreNames.contains('books')) db.createObjectStore('books',{keyPath:'id',autoIncrement:true});
        if(!db.objectStoreNames.contains('loans')) db.createObjectStore('loans',{keyPath:'id',autoIncrement:true});
        if(!db.objectStoreNames.contains('reminds')) db.createObjectStore('reminds',{keyPath:'id',autoIncrement:true});
      };
      r.onsuccess=e=>{db=e.target.result;res()};
      r.onerror=rej;
    });
  }

  function tx(s,m='readonly'){return db.transaction(s,m)}
  function get(s,k){return new Promise(r=>tx(s).objectStore(s).get(k).onsuccess=e=>r(e.target.result))}
  function getAll(s){return new Promise(r=>tx(s).objectStore(s).getAll().onsuccess=e=>r(e.target.result))}
  function put(s,v){return new Promise(r=>tx(s,'readwrite').objectStore(s).put(v).onsuccess=()=>r(true))}
  function add(s,v){return new Promise(r=>tx(s,'readwrite').objectStore(s).add(v).onsuccess=()=>r(true))}
  function del(s,k){return new Promise(r=>tx(s,'readwrite').objectStore(s).delete(k).onsuccess=()=>r(true))}

  async function sha256(s){
    let enc=new TextEncoder();
    let d=await crypto.subtle.digest('SHA-256',enc.encode(s));
    return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  return {
    async init(){
      await openDB();
      if(await get('users','admin')) return;
      for(let u of defaultUsers) await put('users',{...u,pwd:await sha256(u.pwd)});
      for(let b of defaultBooks) await add('books',b);
    },

    async login(user,pwd){
      let u=await get('users',user);
      if(!u)return null;
      if(await sha256(pwd)!==u.pwd)return null;
      return {username:u.username,name:u.name,role:u.role};
    },

    async register(user,name,pwd){
      if(!user||!pwd)return false;
      if(await get('users',user))return false;
      return await put('users',{username:user,name:name||user,pwd:await sha256(pwd),role:'user'});
    },

    async getBooks(){return getAll('books')},
    async getBook(id){return get('books',id)},
    async getUser(user){return get('users',user)},
    async getAllUsers(){return getAll('users')},
    async getAllLoans(){return getAll('loans')},

    async isBookBorrowed(bookId){
      let loans=await getAll('loans');
      return loans.some(l=>l.bookId===bookId && !l.returned);
    },

    async addBook(data){
      return await add('books',{...data,available:data.total});
    },

    async updateBook(id,data){
      let b=await get('books',id);
      if(!b)return false;
      if(await this.isBookBorrowed(id)) return false;
      b.title=data.title;b.author=data.author;b.category=data.category;
      b.total=data.total;b.desc=data.desc;b.available=Math.min(b.available,b.total);
      return await put('books',b);
    },

    async deleteBook(id){
      if(await this.isBookBorrowed(id)) return false;
      return await del('books',id);
    },

    async borrowBook(user,bookId,days){
      let b=await get('books',bookId);
      if(!b||b.available<1)return false;
      let due=new Date();due.setDate(due.getDate()+days);
      await add('loans',{
        bookId,username:user,borrowAt:new Date().toISOString(),
        dueAt:due.toISOString(),returned:false
      });
      b.available--;
      return await put('books',b);
    },

    async returnBook(loanId,bookId){
      let l=await get('loans',loanId);
      if(!l)return false;
      l.returned=true;l.returnAt=new Date().toISOString();
      await put('loans',l);
      let b=await get('books',bookId);
      b.available++;
      return await put('books',b);
    },

    async getActiveLoans(){
      let all=await getAll('loans');
      return all.filter(l=>!l.returned);
    },

    async getUserLoans(user){
      let all=await getAll('loans');
      return all.filter(l=>l.username===user);
    },

    async searchBooks(kw,cat){
      let all=await getAll('books');
      if(cat)all=all.filter(b=>b.category===cat);
      if(kw)all=all.filter(b=>b.title.toLowerCase().includes(kw.toLowerCase())||b.author.toLowerCase().includes(kw.toLowerCase()));
      return all;
    },

    async addReminder(user,book,left){
      return await add('reminds',{username:user,book,left,time:new Date().toISOString()});
    },

    async getMyReminders(user){
      let all=await getAll('reminds');
      return all.filter(r=>r.username===user);
    },

    async clearReminders(user){
      let all=await getAll('reminds');
      for(let r of all){
        if(r.username===user) await del('reminds',r.id);
      }
    }
  }
})();