import { db } from "../db/index";
import { users, medicines } from "../db/schema";
import { AuthService } from "../services/authService";
import { eq } from "drizzle-orm";
import "dotenv/config";

const authService = new AuthService();

// User data
const testUser = {
  email: "test@test.com",
  password: "Test123!!!",
  name: "Test Silva",
};

// Brazilian medicines data
const medicinesData = [
  // Analgésicos
  {
    name: "Dipirona 500mg",
    description: "Analgésico e antipirético",
    location: "Armário do quarto",
    category: "Analgésicos",
    quantity: 30,
    notes: "Tomar 1 comprimido até 4x ao dia",
  },
  {
    name: "Paracetamol 750mg",
    description: "Analgésico e antipirético",
    location: "Cozinha - gaveta superior",
    category: "Analgésicos",
    quantity: 20,
    notes: "Máximo 3g por dia",
  },
  {
    name: "Ibuprofeno 600mg",
    description: "Anti-inflamatório não esteroidal",
    location: "Banheiro - armário espelhado",
    category: "Anti-inflamatórios",
    quantity: 15,
    notes: "Tomar com alimentos",
  },
  {
    name: "Aspirina 500mg",
    description: "Analgésico, antipirético e anti-inflamatório",
    location: "Mesa de cabeceira",
    category: "Analgésicos",
    quantity: 25,
    notes: "Não usar em crianças",
  },
  {
    name: "Naproxeno 550mg",
    description: "Anti-inflamatório não esteroidal",
    location: "Armário da sala",
    category: "Anti-inflamatórios",
    quantity: 12,
    notes: "Uso contínuo sob orientação médica",
  },

  // Antibióticos
  {
    name: "Amoxicilina 500mg",
    description: "Antibiótico de amplo espectro",
    location: "Geladeira - porta",
    category: "Antibióticos",
    quantity: 21,
    notes: "Completar todo o tratamento",
  },
  {
    name: "Azitromicina 500mg",
    description: "Antibiótico macrolídeo",
    location: "Armário do quarto",
    category: "Antibióticos",
    quantity: 6,
    notes: "Tomar em jejum",
  },
  {
    name: "Cefalexina 500mg",
    description: "Antibiótico cefalosporina",
    location: "Cozinha - prateleira alta",
    category: "Antibióticos",
    quantity: 28,
    notes: "Completar 7 dias de tratamento",
  },
  {
    name: "Ciprofloxacino 500mg",
    description: "Antibiótico quinolona",
    location: "Banheiro - gaveta",
    category: "Antibióticos",
    quantity: 14,
    notes: "Evitar laticínios",
  },

  // Medicamentos para gripe e resfriado
  {
    name: "Benegrip",
    description: "Antigripal com paracetamol",
    location: "Mesa da cozinha",
    category: "Antigripe",
    quantity: 8,
    notes: "Máximo 6 envelopes por dia",
  },
  {
    name: "Coristina D",
    description: "Descongestionante nasal",
    location: "Bolsa de mão",
    category: "Antigripe",
    quantity: 10,
    notes: "Não usar por mais de 3 dias",
  },
  {
    name: "Xarope Vick",
    description: "Expectorante para tosse",
    location: "Armário da cozinha",
    category: "Xaropes",
    quantity: 1,
    notes: "Frasco de 120ml",
  },
  {
    name: "Loratadina 10mg",
    description: "Anti-histamínico",
    location: "Carteira",
    category: "Antialérgicos",
    quantity: 30,
    notes: "1 comprimido por dia",
  },
  {
    name: "Cetirizina 10mg",
    description: "Anti-histamínico de 2ª geração",
    location: "Mesa do escritório",
    category: "Antialérgicos",
    quantity: 20,
    notes: "Pode causar sonolência",
  },

  // Medicamentos gastrointestinais
  {
    name: "Omeprazol 20mg",
    description: "Inibidor da bomba de prótons",
    location: "Mesa de jantar",
    category: "Digestivos",
    quantity: 28,
    notes: "Tomar em jejum",
  },
  {
    name: "Pantoprazol 40mg",
    description: "Protetor gástrico",
    location: "Armário do quarto",
    category: "Digestivos",
    quantity: 30,
    notes: "1 hora antes do café da manhã",
  },
  {
    name: "Simeticona 40mg",
    description: "Antiflatulento",
    location: "Cozinha - gaveta",
    category: "Digestivos",
    quantity: 50,
    notes: "Após as refeições",
  },
  {
    name: "Buscopan",
    description: "Antiespasmódico",
    location: "Banheiro - prateleira",
    category: "Digestivos",
    quantity: 20,
    notes: "Para cólicas",
  },
  {
    name: "Plasil 10mg",
    description: "Antiemético",
    location: "Geladeira - gaveta",
    category: "Digestivos",
    quantity: 15,
    notes: "30 min antes das refeições",
  },
  {
    name: "Domperidona 10mg",
    description: "Pró-cinético",
    location: "Mesa da sala",
    category: "Digestivos",
    quantity: 30,
    notes: "15 min antes das refeições",
  },

  // Medicamentos cardiovasculares
  {
    name: "Losartana 50mg",
    description: "Anti-hipertensivo",
    location: "Mesa de cabeceira",
    category: "Cardiovasculares",
    quantity: 30,
    notes: "1x ao dia pela manhã",
  },
  {
    name: "Atenolol 25mg",
    description: "Beta-bloqueador",
    location: "Armário do quarto",
    category: "Cardiovasculares",
    quantity: 30,
    notes: "Controlar pressão arterial",
  },
  {
    name: "Sinvastatina 20mg",
    description: "Redutor de colesterol",
    location: "Cozinha - prateleira",
    category: "Cardiovasculares",
    quantity: 30,
    notes: "Tomar à noite",
  },
  {
    name: "AAS 100mg",
    description: "Antiagregante plaquetário",
    location: "Mesa da cozinha",
    category: "Cardiovasculares",
    quantity: 100,
    notes: "Proteção cardiovascular",
  },

  // Suplementos e vitaminas
  {
    name: "Vitamina D3 2000UI",
    description: "Suplemento vitamínico",
    location: "Mesa do café da manhã",
    category: "Vitaminas",
    quantity: 60,
    notes: "1 cápsula ao dia",
  },
  {
    name: "Complexo B",
    description: "Vitaminas do complexo B",
    location: "Armário da cozinha",
    category: "Vitaminas",
    quantity: 90,
    notes: "Tomar com alimentos",
  },
  {
    name: "Vitamina C 1g",
    description: "Ácido ascórbico",
    location: "Mesa de trabalho",
    category: "Vitaminas",
    quantity: 30,
    notes: "Aumenta imunidade",
  },
  {
    name: "Centrum",
    description: "Polivitamínico mineral",
    location: "Cozinha - bancada",
    category: "Vitaminas",
    quantity: 30,
    notes: "1 comprimido ao dia",
  },
  {
    name: "Omega 3",
    description: "Ácidos graxos essenciais",
    location: "Geladeira - porta",
    category: "Suplementos",
    quantity: 60,
    notes: "2 cápsulas ao dia",
  },

  // Medicamentos dermatológicos
  {
    name: "Bepantol Pomada",
    description: "Cicatrizante e hidratante",
    location: "Banheiro - gaveta do espelho",
    category: "Dermatológicos",
    quantity: 1,
    notes: "Tubo de 30g",
  },
  {
    name: "Cetoconazol Creme 2%",
    description: "Antifúngico tópico",
    location: "Armário do banheiro",
    category: "Dermatológicos",
    quantity: 1,
    notes: "Aplicar 2x ao dia",
  },
  {
    name: "Hidrocortisona 1%",
    description: "Corticoide tópico",
    location: "Banheiro - prateleira alta",
    category: "Dermatológicos",
    quantity: 1,
    notes: "Usar conforme orientação",
  },

  // Medicamentos respiratórios
  {
    name: "Salbutamol Spray",
    description: "Broncodilatador",
    location: "Bolsa de emergência",
    category: "Respiratórios",
    quantity: 1,
    notes: "Para crise de asma",
  },
  {
    name: "Prednisolona 20mg",
    description: "Corticoide oral",
    location: "Armário trancado",
    category: "Corticoides",
    quantity: 10,
    notes: "Uso sob prescrição médica",
  },
  {
    name: "Carbocisteína 500mg",
    description: "Mucolítico",
    location: "Mesa da sala",
    category: "Respiratórios",
    quantity: 20,
    notes: "Dissolve o catarro",
  },

  // Medicamentos neurológicos
  {
    name: "Rivotril 2mg",
    description: "Ansiolítico",
    location: "Cofre pequeno",
    category: "Controlados",
    quantity: 30,
    notes: "USO CONTROLADO - Receita azul",
  },
  {
    name: "Fluoxetina 20mg",
    description: "Antidepressivo",
    location: "Gaveta trancada",
    category: "Antidepressivos",
    quantity: 30,
    notes: "Tomar pela manhã",
  },
  {
    name: "Amitriptilina 25mg",
    description: "Antidepressivo tricíclico",
    location: "Armário com chave",
    category: "Antidepressivos",
    quantity: 30,
    notes: "Tomar à noite",
  },

  // Medicamentos ginecológicos
  {
    name: "Fluconazol 150mg",
    description: "Antifúngico sistêmico",
    location: "Banheiro - gaveta íntima",
    category: "Ginecológicos",
    quantity: 2,
    notes: "Para candidíase",
  },
  {
    name: "Metronidazol 500mg",
    description: "Antibiótico específico",
    location: "Armário do quarto",
    category: "Antibióticos",
    quantity: 14,
    notes: "Para infecções específicas",
  },

  // Medicamentos infantis
  {
    name: "Paracetamol Gotas",
    description: "Analgésico pediátrico",
    location: "Armário do quarto das crianças",
    category: "Pediátricos",
    quantity: 1,
    notes: "Frasco 15ml - conforme peso",
  },
  {
    name: "Ibuprofeno Suspensão",
    description: "Anti-inflamatório infantil",
    location: "Geladeira - prateleira do meio",
    category: "Pediátricos",
    quantity: 1,
    notes: "Frasco 30ml",
  },
  {
    name: "Soro Fisiológico",
    description: "Solução nasal",
    location: "Mesa do bebê",
    category: "Pediátricos",
    quantity: 5,
    notes: "Ampolas de 5ml",
  },

  // Medicamentos para diabetes
  {
    name: "Metformina 850mg",
    description: "Antidiabético",
    location: "Mesa de cabeceira - lado direito",
    category: "Antidiabéticos",
    quantity: 60,
    notes: "Tomar com as refeições",
  },
  {
    name: "Glibenclamida 5mg",
    description: "Hipoglicemiante",
    location: "Cozinha - porta do armário",
    category: "Antidiabéticos",
    quantity: 30,
    notes: "30 min antes do café",
  },

  // Medicamentos oftalmológicos
  {
    name: "Colírio Refresh",
    description: "Lubrificante ocular",
    location: "Mesa de trabalho - gaveta",
    category: "Oftalmológicos",
    quantity: 1,
    notes: "1-2 gotas quando necessário",
  },
  {
    name: "Tobramicina Colírio",
    description: "Antibiótico ocular",
    location: "Geladeira - gaveta de remédios",
    category: "Oftalmológicos",
    quantity: 1,
    notes: "Manter refrigerado",
  },

  // Medicamentos para dor
  {
    name: "Tramadol 50mg",
    description: "Analgésico opioide",
    location: "Cofre de medicamentos",
    category: "Analgésicos",
    quantity: 20,
    notes: "CONTROLADO - Receita amarela",
  },
  {
    name: "Diclofenaco 50mg",
    description: "Anti-inflamatório potente",
    location: "Armário alto da cozinha",
    category: "Anti-inflamatórios",
    quantity: 20,
    notes: "Tomar com alimentos",
  },
  {
    name: "Meloxicam 15mg",
    description: "Anti-inflamatório seletivo",
    location: "Mesa da sala - gaveta",
    category: "Anti-inflamatórios",
    quantity: 15,
    notes: "1x ao dia",
  },

  // Medicamentos para sono
  {
    name: "Zolpidem 10mg",
    description: "Indutor do sono",
    location: "Mesa de cabeceira - gaveta",
    category: "Controlados",
    quantity: 30,
    notes: "CONTROLADO - Tomar antes de dormir",
  },
  {
    name: "Melatonina 3mg",
    description: "Regulador do sono",
    location: "Quarto - criado-mudo",
    category: "Suplementos",
    quantity: 30,
    notes: "1 hora antes de dormir",
  },

  // Medicamentos para alergias
  {
    name: "Polaramine 2mg",
    description: "Anti-histamínico clássico",
    location: "Farmacinha da sala",
    category: "Antialérgicos",
    quantity: 20,
    notes: "Pode causar sonolência",
  },
  {
    name: "Dexametasona 4mg",
    description: "Corticoide potente",
    location: "Armário alto - fundo",
    category: "Corticoides",
    quantity: 10,
    notes: "Uso por curto período",
  },

  // Medicamentos tópicos
  {
    name: "Voltaren Emulgel",
    description: "Anti-inflamatório tópico",
    location: "Mesa da TV",
    category: "Tópicos",
    quantity: 1,
    notes: "Tubo 60g - para dores musculares",
  },
  {
    name: "Cataflan Gel",
    description: "Diclofenaco tópico",
    location: "Banheiro - balcão",
    category: "Tópicos",
    quantity: 1,
    notes: "Aplicar 3-4x ao dia",
  },
  {
    name: "Calêndula Pomada",
    description: "Cicatrizante natural",
    location: "Kit de primeiros socorros",
    category: "Naturais",
    quantity: 1,
    notes: "Para pequenos ferimentos",
  },

  // Medicamentos para vermes
  {
    name: "Albendazol 400mg",
    description: "Antiparasitário",
    location: "Armário da despensa",
    category: "Antiparasitários",
    quantity: 6,
    notes: "Tomar com alimentos gordurosos",
  },
  {
    name: "Mebendazol 100mg",
    description: "Vermífugo",
    location: "Cozinha - prateleira dos remédios",
    category: "Antiparasitários",
    quantity: 6,
    notes: "Para toda a família",
  },

  // Medicamentos para enjoo
  {
    name: "Dramin",
    description: "Antiemético",
    location: "Bolsa de viagem",
    category: "Digestivos",
    quantity: 8,
    notes: "Para viagens longas",
  },
  {
    name: "Vonau Flash",
    description: "Antiemético sublingual",
    location: "Carteira - bolso secreto",
    category: "Digestivos",
    quantity: 4,
    notes: "Dissolve na boca",
  },

  // Medicamentos homeopáticos
  {
    name: "Oscillococcinum",
    description: "Homeopático para gripe",
    location: "Armário da sala - prateleira homeopatia",
    category: "Homeopáticos",
    quantity: 6,
    notes: "Doses sublinguais",
  },
  {
    name: "Arnica 30CH",
    description: "Para traumas e contusões",
    location: "Mesa da entrada",
    category: "Homeopáticos",
    quantity: 1,
    notes: "Glóbulos - 5 antes das refeições",
  },

  // Medicamentos fitoterápicos
  {
    name: "Passiflora 500mg",
    description: "Calmante natural",
    location: "Mesa do quarto",
    category: "Fitoterápicos",
    quantity: 30,
    notes: "1 cápsula à noite",
  },
  {
    name: "Ginkgo Biloba 120mg",
    description: "Para circulação cerebral",
    location: "Escritório - gaveta",
    category: "Fitoterápicos",
    quantity: 60,
    notes: "1 cápsula pela manhã",
  },
  {
    name: "Valeriana 300mg",
    description: "Sedativo natural",
    location: "Quarto - mesa de cabeceira",
    category: "Fitoterápicos",
    quantity: 45,
    notes: "30 min antes de dormir",
  },

  // Primeiros socorros
  {
    name: "Água Oxigenada 10vol",
    description: "Antisséptico",
    location: "Kit primeiros socorros",
    category: "Antissépticos",
    quantity: 1,
    notes: "Frasco 100ml",
  },
  {
    name: "Álcool 70%",
    description: "Desinfetante",
    location: "Banheiro - prateleira baixa",
    category: "Antissépticos",
    quantity: 1,
    notes: "Frasco 500ml",
  },
  {
    name: "Mercúrio Cromo",
    description: "Antisséptico",
    location: "Armário de medicamentos",
    category: "Antissépticos",
    quantity: 1,
    notes: "Frasco 20ml - para ferimentos",
  },
  {
    name: "Band-Aid",
    description: "Curativos adesivos",
    location: "Gaveta da cozinha",
    category: "Curativos",
    quantity: 1,
    notes: "Caixa variada",
  },
  {
    name: "Atadura Elástica",
    description: "Bandagem",
    location: "Kit emergência",
    category: "Curativos",
    quantity: 2,
    notes: "5cm x 4.5m",
  },

  // Medicamentos para articulações
  {
    name: "Glucosamina 500mg",
    description: "Suplemento articular",
    location: "Mesa do café",
    category: "Suplementos",
    quantity: 60,
    notes: "Para saúde das articulações",
  },
  {
    name: "Condroitina 400mg",
    description: "Protetor cartilaginoso",
    location: "Armário da sala",
    category: "Suplementos",
    quantity: 30,
    notes: "Junto com glucosamina",
  },

  // Medicamentos urológicos
  {
    name: "Cisticure",
    description: "Para infecção urinária",
    location: "Banheiro - armário alto",
    category: "Urológicos",
    quantity: 8,
    notes: "Sachês efervescentes",
  },
  {
    name: "Cranberry 500mg",
    description: "Preventivo urinário",
    location: "Mesa da cozinha",
    category: "Suplementos",
    quantity: 30,
    notes: "Para saúde urinária",
  },
];

async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Create or update user
    console.log("👤 Criando usuário de teste...");

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, testUser.email))
      .limit(1);

    let userId: number;

    if (existingUser.length > 0) {
      console.log("✅ Usuário já existe, atualizando...");
      userId = existingUser[0].id;

      // Update user with new password hash
      const passwordHash = await authService.hashPassword(testUser.password);
      await db
        .update(users)
        .set({
          name: testUser.name,
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      console.log("✅ Criando novo usuário...");
      const passwordHash = await authService.hashPassword(testUser.password);

      const newUser = await db
        .insert(users)
        .values({
          email: testUser.email,
          name: testUser.name,
          passwordHash,
        })
        .returning({ id: users.id });

      userId = newUser[0].id;
    }

    // Delete existing medicines for this user
    console.log("🗑️  Limpando medicamentos existentes...");
    await db.delete(medicines).where(eq(medicines.userId, userId));

    // Insert medicines
    console.log("💊 Inserindo medicamentos brasileiros...");

    const medicinesWithUser = medicinesData.map((medicine, index) => ({
      ...medicine,
      userId,
      // Add some variety in expiry dates
      expiryDate: new Date(
        Date.now() + Math.random() * 365 * 2 * 24 * 60 * 60 * 1000
      ), // Random date within 2 years
    }));

    // Insert in batches to avoid overwhelming the database
    const batchSize = 20;
    for (let i = 0; i < medicinesWithUser.length; i += batchSize) {
      const batch = medicinesWithUser.slice(i, i + batchSize);
      await db.insert(medicines).values(batch);
      console.log(
        `✅ Inseridos ${Math.min(i + batchSize, medicinesWithUser.length)}/${
          medicinesWithUser.length
        } medicamentos`
      );
    }

    console.log("🎉 Seed concluído com sucesso!");
    console.log(`👤 Usuário criado: ${testUser.email}`);
    console.log(`🔐 Senha: ${testUser.password}`);
    console.log(`💊 Total de medicamentos: ${medicinesData.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seed();
}

export { seed };
