<script>
  let name = $state('');
  let email = $state('');
  let whatsapp = $state('');
  
  let selectedDay = $state('Senin');
  let selectedSession = $state('1');
  
  let packageCategory = $state('Personal'); // 'Personal' or 'Grup'
  let selectedPackage = $state(null); // 1 or 2
  
  let groupMembers = $state('');
  let groupWhatsapp = $state('');
  
  let proofFile = $state(null);
  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Minggu'];
  const sessions = [
    { id: '1', time: '09:00 - 13:00' },
    { id: '2', time: '14:30 - 18:30' }
  ];

  const packages = {
    Personal: [
      { id: 1, price: 'Rp 25.000', location: 'Pamulang', max: 1, benefits: ['Pelatihan secara langsung dipamulang', 'Bergabung grup WhatsApp untuk diskusi', 'Gratis air mineral'] },
      { id: 2, price: 'Rp 35.000', location: 'Ditentukan oleh kelompok', max: 1, benefits: ['Pelatihan secara langsung', 'Bergabung grup WhatsApp untuk diskusi'] }
    ],
    Grup: [
      { id: 1, price: 'Rp 120.000', location: 'Pamulang', max: 6, benefits: ['Maksimal anggota 6 orang', 'Pelatihan secara langsung dipamulang', 'Bergabung grup WhatsApp untuk diskusi', 'Gratis air mineral'] },
      { id: 2, price: 'Rp 180.000', location: 'Ditentukan oleh kelompok', max: 6, benefits: ['Maksimal anggota 6 orang', 'Pelatihan secara langsung', 'Bergabung grup WhatsApp untuk diskusi'] }
    ]
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedPackage) {
      alert('Silakan pilih paket terlebih dahulu.');
      return;
    }
    
    if (packageCategory === 'Grup' && (!groupMembers || !groupWhatsapp)) {
      alert('Data anggota grup dan no WhatsApp grup wajib diisi untuk paket Grup.');
      return;
    }

    if (!proofFile) {
      alert('Bukti pembayaran wajib diunggah.');
      return;
    }

    isSubmitting = true;
    
    // Simulate API call for form submission including file upload
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('whatsapp', whatsapp);
      formData.append('day', selectedDay);
      formData.append('session', selectedSession);
      formData.append('packageCategory', packageCategory);
      formData.append('selectedPackage', selectedPackage);
      
      if (packageCategory === 'Grup') {
        formData.append('groupMembers', groupMembers);
        formData.append('groupWhatsapp', groupWhatsapp);
      }
      
      formData.append('proof', proofFile);

      // API call for form submission including file upload
      const response = await fetch('http://localhost:3000/api/register', { 
        method: 'POST', 
        body: formData 
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pendaftaran');
      }
      
      isSuccess = true;
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mendaftar.');
    } finally {
      isSubmitting = false;
    }
  }

  function handleFileChange(e) {
    if (e.target.files.length > 0) {
      proofFile = e.target.files[0];
    }
  }
</script>

<div class="container">
  {#if isSuccess}
    <div class="success-message">
      <div class="success-icon">✓</div>
      <h2>Pendaftaran Berhasil!</h2>
      <p style="margin-top: 1rem; color: var(--text-light);">Terima kasih telah mendaftar. Tim kami akan segera memverifikasi pembayaran Anda dan menghubungi melalui WhatsApp.</p>
      <button class="button-primary" style="margin-top: 2rem; width: auto; padding: 0.8rem 2rem;" onclick={() => {
        isSuccess = false;
        name = ''; email = ''; whatsapp = ''; groupMembers = ''; groupWhatsapp = ''; proofFile = null; selectedPackage = null;
      }}>Daftar Lagi</button>
    </div>
  {:else}
    <div class="header">
      <h1>Pendaftaran Pelatihan</h1>
      <p>Tingkatkan skill kamu bersama ahlinya</p>
    </div>

    <form class="form-body" onsubmit={handleSubmit}>
      <h3 class="section-title" style="margin-top: 0;">Data Diri</h3>
      
      <div class="form-group">
        <label for="name">Nama Lengkap</label>
        <input type="text" id="name" bind:value={name} required placeholder="Masukkan nama lengkap Anda" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={email} required placeholder="email@contoh.com" />
      </div>

      <div class="form-group">
        <label for="whatsapp">No WhatsApp</label>
        <input type="tel" id="whatsapp" bind:value={whatsapp} required placeholder="08123456789" />
      </div>

      <h3 class="section-title">Jadwal Pelatihan</h3>
      
      <div class="form-group">
        <label for="day">Hari</label>
        <select id="day" bind:value={selectedDay}>
          {#each days as day}
            <option value={day}>{day}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="session">Sesi</label>
        <select id="session" bind:value={selectedSession}>
          {#each sessions as s}
            <option value={s.id}>Sesi {s.id} ({s.time})</option>
          {/each}
        </select>
      </div>

      <h3 class="section-title">Pilihan Paket</h3>
      
      <div class="form-group">
        <label>Kategori Paket</label>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" value="Personal" bind:group={packageCategory} onchange={() => selectedPackage = null} />
            Personal
          </label>
          <label class="radio-item">
            <input type="radio" value="Grup" bind:group={packageCategory} onchange={() => selectedPackage = null} />
            Grup
          </label>
        </div>
      </div>

      <div class="package-cards">
        {#each packages[packageCategory] as pkg}
          <div class="package-card" class:selected={selectedPackage === pkg.id} onclick={() => selectedPackage = pkg.id}>
            <div class="package-type">Paket {pkg.id}</div>
            <div class="package-price">{pkg.price}</div>
            <div class="package-loc">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {pkg.location}
            </div>
            <ul class="package-benefits">
              {#each pkg.benefits as benefit}
                <li>{benefit}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>

      {#if packageCategory === 'Grup'}
        <h3 class="section-title">Informasi Grup</h3>
        <div class="group-member-card">
          <div class="form-group">
            <label for="groupMembers">Nama Anggota Grup (Maks. 6 orang)</label>
            <textarea id="groupMembers" bind:value={groupMembers} rows="3" required placeholder="1. Budi&#10;2. Andi&#10;..." ></textarea>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label for="groupWhatsapp">No WhatsApp Anggota Grup</label>
            <textarea id="groupWhatsapp" bind:value={groupWhatsapp} rows="3" required placeholder="1. 0812...&#10;2. 0813...&#10;..."></textarea>
          </div>
        </div>
      {/if}

      <h3 class="section-title">Pembayaran</h3>
      <div class="form-group">
        <label for="proof">Upload Bukti Pembayaran</label>
        <p class="file-upload-desc" style="margin-bottom: 10px;">
          <strong>Penting:</strong> Untuk paket grup, pembayaran dapat dilakukan melalui perwakilan (satu orang). 
          Pastikan untuk mentransfer ke akun <strong>DANA: 0812-3456-7890</strong> (a.n. Admin Pelatihan).
        </p>
        <input type="file" id="proof" accept="image/*,.pdf" onchange={handleFileChange} required />
      </div>

      <button type="submit" class="button-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Memproses...' : 'Kirim Pendaftaran'}
      </button>
    </form>
  {/if}
</div>
